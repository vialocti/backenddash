import coneccionDB from '../database.js'
import dotenv from 'dotenv'
import openai from "../configopenai.js";
import { readFile } from "fs/promises";
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
  const empiezaConSelect = limpia.substring(4,100).startsWith('SELECT');
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
      const result = await coneccionDB.query(sqlstr.substring(4,1000));
      res.send(result.rows)
      //ejecutarConsulta(sqlstr);
    } else {
      console.warn('Consulta bloqueada: solo se permiten consultas SELECT.');
      res.send([{messages:"no data consulta no valida"}])
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
    res.status(500).send([{messages:'Error en la generación de SQL'}]);
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
        const assistantId =process.env.OPENAI_ASSISTANT_ID_2
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


/////

//////
/*
export const analizarDatos = async (req, res) => {
  try {
    const { datos, instrucciones } = req.body;
    console.log(datos, instrucciones)

    if (!datos || !Array.isArray(datos)) {
      return res.status(400).json({ error: 'Debes enviar un array de datos en el body' });
    }

    if (!instrucciones || typeof instrucciones !== 'string') {
      return res.status(400).json({ error: 'Debes enviar las instrucciones como un string' });
    }

    // ✅ Usamos el assistant ya creado
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    // Crear un nuevo thread (conversación nueva)
    const thread = await openai.beta.threads.create();

    // Enviar el mensaje con los datos y las instrucciones del usuario
    const mensaje = `
      Aquí tienes los datos en JSON:

      ${JSON.stringify(datos, null, 2)}

      ${instrucciones}
    `;

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: mensaje
    });

    // Iniciar el análisis con el assistant ya existente
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    // Esperar que termine el run
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Obtener los mensajes con el análisis
    const messages = await openai.beta.threads.messages.list(thread.id);

    const respuesta = messages.data.reverse().map((message) => {
      const partes = message.content.map((part) => {
        if (part.type === 'text') {
          return part.text.value;
        } else if (part.type === 'image_file') {
          return `Imagen generada con file_id: ${part.image_file.file_id}`;
        }
      });

      return {
        role: message.role,
        content: partes
      };
    });

    return res.status(200).json({
      message: 'Análisis completado',
      respuesta
    });

  } catch (error) {
    console.error("Error en analizarDatos:", error);
    return res.status(500).json({ error: 'Error procesando los datos' });
  }
};

*/