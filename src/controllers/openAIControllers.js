import coneccionDB from '../database.js'
import dotenv from 'dotenv'
import openai from "../configopenai.js";
import { readFile } from "fs/promises";
import { fileSearchTool, Agent, Runner, withTrace } from "@openai/agents";

import { runGuardrails } from "@openai/guardrails";
import { z } from "zod";
/*
const coneccionDB = require('../database.js');
const dotenv = require('dotenv');
const openai = require('../configopenai.js');
const { readFile } = require('fs/promises');
*/
dotenv.config()


const loadDatabaseSchema = async () => {
  try {
    const data = await readFile(`${__dirname}/database_schema.json`, "utf8");
    //const data = await readFile("./database_schema.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading database schema:", error);
    return null;
  }
};


function limpiarConsultaSQL(cadena) {
  // Eliminamos comentarios SQL (todo después de -- o /* hasta el final de la línea)
  let cleanedQuery = cadena.replace(/--.*$/gm, ''); // Elimina comentarios de una sola línea
  cleanedQuery = cleanedQuery.replace(/\/\*[\s\S]*?\*\//g, ''); // Elimina comentarios multilínea

  // Eliminamos los backticks
  cleanedQuery = cleanedQuery.replace(/`/g, ''); // Elimina los backticks

  // Solo eliminamos los espacios extra, sin tocar las comillas
  cleanedQuery = cleanedQuery.trim().replace(/\s+/g, ' '); // Elimina espacios extra

  return cleanedQuery;
}

/*

export const consultasOpenai = async (req, res) => {
  const { question } = req.body;
  
  // Cargar la estructura de la base de datos
  const schema = await loadDatabaseSchema();
  console.log(question, schema);

  // Verificar que se haya cargado correctamente el esquema
  if (!schema) {
    return res.status(500).json({ error: "No se pudo cargar la estructura de la base de datos" });
  }

  try {
    // Crear una solicitud de completación a OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // El modelo de GPT que estamos usando
      messages: [
        {
          role: "system", 
          content: "Genera consultas SQL para PostgreSQL basadas en la estructura de la base de datos proporcionada, solo devuelve la sentencia SQL bien definida elimina cualquier caracter que produza error."
        },
        {
          role: "system", 
          content: "tener en cuenta si preguntan por carrera se refieren a propuesta, si dicen sede se refieren a ubicacion si dicen coeficiente refieren a coef_tcarrera cuando dice porciento de la carrera ver campo completado "
        },
        {
          role: "system", 
          content: "siempre convierte ubicacion 1 por MZA, 2 por SR 3 por GAV y 4 por ES, las propuesta 1 CPN, 2 LA, 3 LE, 6 LNRG, 7 LLO y 8 CP "
        },
        {
          role: "system", 
          content: "si te preguntan año de cursada se refiren a anio_cursada, si te preguntan por ingresantes se refieren a los de anio_ingreso_pro del año actual "
        },
        {
          role: "system", 
          content: "cuando en la consulta dicen 1er o primer , 2do o segundo, o tercer... año cursada, esta refiriendo a la columna aniocursada que toma valores 1 a 5 segun año de cursada "
        },
        {
          role: "system", 
          content: "en la consulta deben solo haber palabras como estudiantes, alumnos, coeficiente, año de cursada y todo lo referido a la tabla del schema"
        },  
        {
          role: "system", 
          content: "si hay palabras no coherentes con el esquema de la tabla como temperatura, animales u otro que no corresponda con alumnos crea por defecto la consulta 'SELECT COUNT(*) FROM fce_per.alumnos_info' "
        },
        {
          role: "user", 
          content: `Estructura de la base de datos: ${JSON.stringify(schema)}\nPregunta: ${question}`
        }
      ]
    });

    // Extraer solo la consulta SQL (sin la explicación)
    const sqlQuery = limpiarConsultaSQL(response.choices[0].message.content);
    //console.log("Consulta SQL generada:", sqlQuery);

    const sqldef =sqlQuery.substring(4,400)
    //console.log(sqldef)
    //Ejecutar la consulta en la base de datos (PostgreSQL)
    const result = await coneccionDB.query(sqldef);

    // Devolver la consulta SQL generada y los resultados de la base de datos
    res.send(result.rows );
    //res.send(sqldef)
  } catch (error) {
    console.error("Error generando o ejecutando la consulta:", error);
    res.status(500).json({ error: "Error procesando la solicitud" });
  }
};

*/
///////
//////////
function esConsultaSelect(sql) {
  const limpia = sql.trim().toUpperCase();

  // Validamos que empieza con SELECT y no contiene palabras peligrosas
  const empiezaConSelect = limpia.substring(4, 100).startsWith('SELECT');
  const contieneProhibidas = /(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|REPLACE)/.test(limpia);

  return empiezaConSelect && !contieneProhibidas;
}

/////
export const consultasOpenaiNew = async (req, res) => {

  const { pregunta } = req.body;
  //console.log(`Pregunta recibida: ${pregunta}`);

  // console.log(process.env.OPENAI_ASSISTANT_ID_2)
  const assistantId = process.env.OPENAI_ASSISTANT_ID_1
  let currentThreadId = ''//req.session.threadId; // Obtener el threadId de la sesión


  try {


    // 1️⃣ Si no hay un threadId en sesión, se crea uno nuevo
    //if (!currentThreadId) {
    const thread = await openai.beta.threads.create();
    currentThreadId = thread.id;
    //req.session.threadId = currentThreadId; // Guardar en la sesión
    //console.log(`Nuevo threadId creado: ${currentThreadId}`);
    //} else {
    //  console.log(`Usando threadId existente: ${currentThreadId}`);
    //}

    // 2️⃣ Enviar la pregunta al Assistant
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: pregunta
    });

    // 3️⃣ Iniciar la ejecución con el Assistant configurado
    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: assistantId
    });

    // 4️⃣ Esperar la respuesta
    let respuesta;
    while (!respuesta) {
      const runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      if (runStatus.status === "completed") {
        const messages = await openai.beta.threads.messages.list(currentThreadId);
        respuesta = messages.data[0].content[0].text.value; // Obtener la respuesta SQL
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar un segundo antes de verificar de nuevo
    }
    //console.log(respuesta)
    let sqlstr = limpiarConsultaSQL(respuesta);
    //console.log(sqlstr.substring(4,1000))
    // 5️⃣ Ejecutar la consulta en la base de datos
    if (esConsultaSelect(sqlstr)) {
      // Ejecutar consulta 
      const result = await coneccionDB.query(sqlstr.substring(4, 1000));
      res.send(result.rows)
      //ejecutarConsulta(sqlstr);
    } else {
      console.warn('Consulta bloqueada: solo se permiten consultas SELECT.');
      res.send([{ messages: "no data consulta no valida" }])
    }

    // 6️⃣ Responder con la consulta SQL generada y los resultados
    /* res.json({
       sql: sqlstr,
       data: result.rows,
       threadId: currentThreadId // Se devuelve el threadId por si se necesita en el frontend
     });
     */


  } catch (error) {
    console.error("Error generando SQL:", error);
    res.status(500).send([{ messages: 'Error en la generación de SQL' }]);
  }
};





export const getAnalizador_datos = async (req, res) => {
  try {
    const { rows } = req.body; // Extraer los datos del body
    //console.log('hola')
    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({ error: "Datos inválidos, se esperaba una lista de alumnos." });
    }

    const datos = JSON.stringify(rows);
    const assistantId = process.env.OPENAI_ASSISTANT_ID_2
    let currentThreadId = ''//req.session.threadId; // Obtener el threadId de la sesión

    const thread = await openai.beta.threads.create();
    currentThreadId = thread.id;
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: datos
    });

    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: assistantId
    });

    // 4️⃣ Esperar la respuesta
    let respuesta;
    while (!respuesta) {
      const runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      if (runStatus.status === "completed") {
        const messages = await openai.beta.threads.messages.list(currentThreadId);
        respuesta = messages.data[0].content[0].text.value; // Obtener la respuesta SQL
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar un segundo antes de verificar de nuevo
    }
    //console.log(respuesta)
    res.json(respuesta)
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};




export const askAssistant = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query no enviada" });

    const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID_HELP;

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: query,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (!["completed", "failed", "expired"].includes(runStatus.status)) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } while (!["completed", "failed", "expired"].includes(runStatus.status));
    //console.log(query)
    const messages = await openai.beta.threads.messages.list(thread.id);

    const assistantResponses = [];
    messages.data.forEach((msg) => {
      if (msg.role === "assistant") {
        msg.content.forEach((c) => {
          if (c.type === "text") {
            assistantResponses.push(c.text.value);
          }
        });
      }
    });



    // 🔥 Normalizar salida a string
    const reply = assistantResponses.join("\n\n");
    //console.log(reply)
    return res.json({ reply });


    //return res.json({ responses: assistantResponses[0] });
  } catch (error) {
    console.error(error.response?.data || error.message || error);
    return res.status(500).json({ error: "Error consultando al asistente" });
  }
};


export const askAssistant_R = async (req, res) => {


  try {

    const client = openai; // asumimos que ya lo inicializaste en otro módulo
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query no enviada" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
            Eres un asistente amable y servicial para un Sistema de Información Académica.
            Tu tarea es responder **solo** con base en la información contenida en los documentos del sistema.
            tus respuestas deben ser concisas, directas al punto y no mayor a 50 palabras. 
            recuerda que los alumnos pueden ser de plan 2019 o plan 98
            Si no encuentras información relacionada, responde exactamente:
            
            "No hay información al respecto sobre ese tema. Puede ser que todavía no se ha procesado información del tema."
            
            Mantén un tono empático, claro y profesional.
          `,
        },
        {
          role: "user",
          content: query,
        },
      ],
      tools: [
        {
          type: "file_search",
          vector_store_ids: [process.env.VECTOR_STORE_ID],

        },
      ],


    });

    const textoRespuesta =
      response.output_text ||
      "No se obtuvo una respuesta del asistente.";
    //console.log("Respuesta del asistente:", textoRespuesta);
    res.json({ respuesta: textoRespuesta });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({
      error: "Error interno al procesar la solicitud de ayuda.",
      detalle: error.message,
    });
  }
};




export const getAnalizador_datos_R = async (req, res) => {
  try {
    const client = openai;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query no enviada" });
    }

    // ✅ Convertimos el objeto a texto legible para el modelo
    const queryText = `
      Datos de actividades aprobadas (datosA):
      ${query.datosA || "Ninguna"}

      Datos de actividades regulares (datosAreg):
      ${query.datosAreg || "Ninguna"}
    `;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
            Eres un analizador de cambio de plan de estudios. 
            En función de las actividades aprobadas y regulares que se envían,
            determinás cuáles son equivalentes en el nuevo plan de estudios,
            usando los archivos equivalencia y resolucion1.
            si la materia esta aprobada  debes poner T, si la materia no esta Aprobada pero si regular debes poner R
            Debes responder tipo tabla:
            [Actividad aprobada] - [Actividad equivalente plan nuevo] [T | R].
            Sé conciso, directo, y no excedas 30 palabras. podrias ordenar alfabeticamente
          `,
        },
        {
          role: "user",
          content: queryText, // 👈 ahora es texto legible
        },
      ],
      tools: [
        {
          type: "file_search",
          vector_store_ids: [
            process.env.VECTOR_STORE_ID_EQ,
            process.env.VECTOR_STORE_ID_RES1,
          ],
        },
      ],
    });

    const textoRespuesta =
      response.output_text || "No se obtuvo una respuesta del asistente.";
    res.json({ respuesta: textoRespuesta });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

///////Agente Equivalencias 7////////
///agentes de equivalencias



// Configuración del API Key de OpenAI
// Nota: 'process.env.OPENAI_API_KEY' es específico de Node.js


// Definición de Herramientas
const fileSearch = fileSearchTool([
  "vs_690927e75ce481919279f56184c59002" // ID del Vector Store
])

// Definiciones de Guardrails
const guardrailsConfig = {
  guardrails: [
    { name: "Contains PII", config: { block: false, detect_encoded_pii: true, entities: ["CREDIT_CARD", "US_BANK_NUMBER", "US_PASSPORT", "US_SSN"] } }
  ]
};
const context = { guardrailLlm: openai };

/**
 * Verifica si algún resultado de Guardrails activó un "tripwire" (fallo).
 * @param {Array} results - Resultados de la ejecución de Guardrails.
 * @returns {boolean}
 */
function guardrailsHasTripwire(results) {
  return (results ?? []).some((r) => r?.tripwireTriggered === true);
}

/**
 * Obtiene el texto seguro (sanitizado) de los resultados de Guardrails.
 * @param {Array} results - Resultados de la ejecución de Guardrails.
 * @param {string} fallbackText - Texto a usar si no se encuentra texto seguro.
 * @returns {string}
 */
function getGuardrailSafeText(results, fallbackText) {
  for (const r of results ?? []) {
    if (r?.info && ("checked_text" in r.info)) {
      return r.info.checked_text ?? fallbackText;
    }
  }
  const pii = (results ?? []).find((r) => r?.info && "anonymized_text" in r.info);
  return pii?.info?.anonymized_text ?? fallbackText;
}

/**
 * Limpia el historial de conversación, aplicando anonimización si es necesario.
 * @param {Array} history - El historial de conversación.
 * @param {Object} piiOnly - Configuración de Guardrails solo para PII.
 * @returns {Promise<void>}
 */
async function scrubConversationHistory(history, piiOnly) {
  for (const msg of history ?? []) {
    const content = Array.isArray(msg?.content) ? msg.content : [];
    for (const part of content) {
      if (part && typeof part === "object" && part.type === "input_text" && typeof part.text === "string") {
        const res = await runGuardrails(part.text, piiOnly, context, true);
        part.text = getGuardrailSafeText(res, part.text);
      }
    }
  }
}

/**
 * Limpia la entrada del flujo de trabajo, aplicando anonimización si es necesario.
 * @param {Object} workflow - Objeto del flujo de trabajo.
 * @param {string} inputKey - La clave de la entrada a limpiar.
 * @param {Object} piiOnly - Configuración de Guardrails solo para PII.
 * @returns {Promise<void>}
 */
async function scrubWorkflowInput(workflow, inputKey, piiOnly) {
  if (!workflow || typeof workflow !== "object") return;
  const value = workflow?.[inputKey];
  if (typeof value !== "string") return;
  const res = await runGuardrails(value, piiOnly, context, true);
  workflow[inputKey] = getGuardrailSafeText(res, value);
}

/**
 * Ejecuta Guardrails y aplica la limpieza al historial y la entrada del flujo.
 * @param {string} inputText - El texto de entrada del usuario.
 * @param {Object} config - Configuración completa de Guardrails.
 * @param {Array} history - El historial de conversación.
 * @param {Object} workflow - El objeto del flujo de trabajo.
 * @returns {Promise<Object>}
 */
async function runAndApplyGuardrails(inputText, config, history, workflow) {
  const guardrails = Array.isArray(config?.guardrails) ? config.guardrails : [];
  const results = await runGuardrails(inputText, config, context, true);
  // Verifica si la configuración incluye enmascaramiento de PII (block: false)
  const shouldMaskPII = guardrails.find((g) => (g?.name === "Contains PII") && g?.config && g.config.block === false);

  if (shouldMaskPII) {
    const piiOnly = { guardrails: [shouldMaskPII] };
    await scrubConversationHistory(history, piiOnly);
    await scrubWorkflowInput(workflow, "input_as_text", piiOnly);
    await scrubWorkflowInput(workflow, "input_text", piiOnly);
  }

  const hasTripwire = guardrailsHasTripwire(results);
  const safeText = getGuardrailSafeText(results, inputText) ?? inputText;
  return {
    results,
    hasTripwire,
    safeText,
    failOutput: buildGuardrailFailOutput(results ?? []),
    passOutput: { safe_text: safeText }
  };
}

/**
 * Construye el objeto de salida de fallo de Guardrails para el flujo.
 * @param {Array} results - Resultados de la ejecución de Guardrails.
 * @returns {Object}
 */
function buildGuardrailFailOutput(results) {
  const get = (name) => (results ?? []).find((r) => ((r?.info?.guardrail_name ?? r?.info?.guardrailName) === name));
  const pii = get("Contains PII");
  const mod = get("Moderation");
  const jb = get("Jailbreak");
  const hal = get("Hallucination Detection");
  const nsfw = get("NSFW Text");
  const url = get("URL Filter");
  const custom = get("Custom Prompt Check");
  const pid = get("Prompt Injection Detection");
  const piiCounts = Object.entries(pii?.info?.detected_entities ?? {}).filter(([, v]) => Array.isArray(v)).map(([k, v]) => k + ":" + v.length);

  return {
    pii: { failed: (piiCounts.length > 0) || pii?.tripwireTriggered === true, detected_counts: piiCounts },
    moderation: { failed: mod?.tripwireTriggered === true || ((mod?.info?.flagged_categories ?? []).length > 0), flagged_categories: mod?.info?.flagged_categories },
    jailbreak: { failed: jb?.tripwireTriggered === true },
    hallucination: { failed: hal?.tripwireTriggered === true, reasoning: hal?.info?.reasoning, hallucination_type: hal?.info?.hallucination_type, hallucinated_statements: hal?.info?.hallucinated_statements, verified_statements: hal?.info?.verified_statements },
    nsfw: { failed: nsfw?.tripwireTriggered === true },
    url_filter: { failed: url?.tripwireTriggered === true },
    custom_prompt_check: { failed: custom?.tripwireTriggered === true },
    prompt_injection: { failed: pid?.tripwireTriggered === true },
  };
}

// Esquema de salida estructurada (Zod) para AgenteEntrada
const AgenteEntradaSchema = z.object({
  status: z.string(),
  codigo: z.number(),
  materias: z.array(z.string())
});

// Definiciones de Nodos Agente
const agenteEntrada = new Agent({
  name: "Agente_Entrada",
  instructions: `recibiras la informacion de carrera_origen , carera_destino y mat_aprobadas
si la carrera_origen es una de estas CPN98, LA98, LE98, CP19, LA19 u LE19 y la carrera_destino sea CP26 o LA26 o LE26, contesta carreras validas y si hay un listado en mat_aprobadas, 
si carrera origen es LA19 o LA98 y carrera destino es LA26
entonces 
{ 
"status:'validos",
"codigo":1,
"materias":materias_aprobadas
}
si no 
{ 
"status:'validos",
"codigo":10,
"materias":materias_aprobadas
}`,
  model: "gpt-4.1",
  outputType: AgenteEntradaSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const agentAdministracion = new Agent({
  name: "Agent Administracion",
  instructions: `en base al documento verificaras las 
equivalencias concedidas y la salida debe solo contener listado de materias aprobadas por equivalencias solamente de la forma siguiente.
ejemplo materia_name se da por equivalecia de materia aprobada,
si hay mas de una materia ya sea de aprobadas o de equivalentes
seria como este ejemplo
matematica II aprobada por Algebra y Calculo
al final crear un array con las materias aprobadas por equivalencias las del plan destino no las que se pasan como aprobadas`,
  model: "gpt-4.1",
  tools: [
    fileSearch
  ],
  modelSettings: {
    temperature: 1.46,
    topP: 0.5,
    maxTokens: 2048,
    store: true
  }
});

const agent = new Agent({
  name: "Agent",
  instructions: "condicion valida ir al decir ir a doc: documento 2",
  model: "gpt-4.1",
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const agent1 = new Agent({
  name: "Agent",
  instructions: "condicion valida ir al decir ir a doc: documento n",
  model: "gpt-4.1",
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

// Tipado implícito en JS para la entrada del flujo
// type WorkflowInput = { input_as_text: string };


// Punto de entrada principal del código
/**
 * Ejecuta el flujo de trabajo de análisis de equivalencias.
 * @param {{input_as_text: string}} workflow - Objeto que contiene el texto de entrada.
 * @returns {Promise<any>}
 */
const runWorkflow = async (workflow) => {
  return await withTrace("Analisis_Equivalencias", async () => {
    // El objeto state no se utiliza actualmente, pero se mantiene para la estructura del flujo
    const state = {};

    // Inicialización del historial de conversación con la entrada del usuario
    const conversationHistory = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];

    // Inicialización del Runner
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6928720e2b588190ba6a260e0c0d307b058620db2344363a"
      }
    });

    // --- Nodo Guardrails ---
    const guardrailsInputText = workflow.input_as_text;
    const { hasTripwire: guardrailsHasTripwire, failOutput: guardrailsFailOutput, passOutput: guardrailsPassOutput } = await runAndApplyGuardrails(guardrailsInputText, guardrailsConfig, conversationHistory, workflow);

    const guardrailsOutput = (guardrailsHasTripwire ? guardrailsFailOutput : guardrailsPassOutput);

    if (guardrailsHasTripwire) {
      // Si falla Guardrails, termina el flujo y devuelve el resultado del fallo
      return guardrailsOutput;
    } else {
      // --- Nodo AgenteEntrada (Validación y Estructura) ---
      const agenteEntradaResultTemp = await runner.run(
        agenteEntrada,
        [
          ...conversationHistory
        ]
      );

      // Actualiza el historial con la respuesta del agente (si es relevante, aunque este agente es de tipo JSON)
      conversationHistory.push(...agenteEntradaResultTemp.newItems.map((item) => item.rawItem));

      if (!agenteEntradaResultTemp.finalOutput) {
        // En un entorno de producción, esto debería ser manejado por un nodo End o un mensaje de error
        throw new Error("Agent result is undefined");
      }

      const agenteEntradaResult = {
        output_text: JSON.stringify(agenteEntradaResultTemp.finalOutput),
        output_parsed: agenteEntradaResultTemp.finalOutput
      };

      // --- Bifurcación Condicional ---
      if (agenteEntradaResult.output_parsed.codigo == 1) {
        // --- AgenteAdministracion (Busca en documentos) ---
        const agentAdministracionResultTemp = await runner.run(
          agentAdministracion,
          [
            ...conversationHistory
          ]
        );

        if (!agentAdministracionResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
        }

        // Devuelve el resultado del agente de administración
        return {
          output_text: agentAdministracionResultTemp.finalOutput ?? ""
        };

      } else if (agenteEntradaResult.output_parsed.codigo == 2) {
        // --- Agente 1 ---
        const agentResultTemp = await runner.run(
          agent,
          [
            ...conversationHistory
          ]
        );
        conversationHistory.push(...agentResultTemp.newItems.map((item) => item.rawItem));

        if (!agentResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
        }

        return {
          output_text: agentResultTemp.finalOutput ?? ""
        };
      } else {
        // --- Agente 2 (Condición por defecto) ---
        const agentResultTemp = await runner.run(
          agent1,
          [
            ...conversationHistory
          ]
        );
        conversationHistory.push(...agentResultTemp.newItems.map((item) => item.rawItem));

        if (!agentResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
        }

        return {
          output_text: agentResultTemp.finalOutput ?? ""
        };
      }
    }
  });
}


/**
 * Controlador de Express para manejar la solicitud de análisis de equivalencias.
 * Espera un cuerpo JSON y lo convierte al formato de entrada del workflow.
 * * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const analyzeEquivalencies = async (req, res) => {
    // 1. Validar la existencia del cuerpo de la petición
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud no puede estar vacío.' });
    }

    try {
        // 2. Convertir el cuerpo JSON (ej: { origen: 'CP19', ... }) a una cadena de texto.
        // El primer Agente está instruido para procesar esta cadena.
        const workflowInputString = JSON.stringify(req.body);

        // 3. Crear el objeto de entrada del workflow.
        const workflowInput = {
            input_as_text: workflowInputString
        };

        // 4. Ejecutar el flujo de trabajo principal
        console.log("Iniciando flujo de trabajo con entrada:", workflowInputString);
        const result = await runWorkflow(workflowInput);
        
        // 5. Enviar la respuesta del flujo al cliente
        res.status(200).json(result);

    } catch (error) {
        console.error('Error durante la ejecución del flujo de trabajo:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al procesar las equivalencias.',
            details: error.message
        });
    }
};