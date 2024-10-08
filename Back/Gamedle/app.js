const axios = require('axios');
const readline = require('readline');
const https = require('https');
const express = require('express');
require('dotenv').config();

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;
const IGDB_API_URL = 'https://api.igdb.com/v4/games';
const COMPANIES_API_URL = 'https://api.igdb.com/v4/involved_companies';
const ENGINES_API_URL = 'https://api.igdb.com/v4/game_engines';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function obtenerListaJuegos() {
  try {
    let pagina = Math.floor(Math.random() * 10) + 1;
    let respuesta = await axios.post(
      IGDB_API_URL,
      `fields name, platforms.name, genres.name, themes.name, game_modes.name, first_release_date, release_dates.human, player_perspectives.name, involved_companies.company.name, game_engines.name; limit 10; offset ${pagina * 10};`,
      {
        headers: {
          'Client-ID': CLIENT_ID,
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'text/plain'
        },
        httpsAgent
      }
    );
    let juegoRandomIndex = Math.floor(Math.random() * respuesta.data.length);
    return respuesta.data[juegoRandomIndex];
  } catch (error) {
    console.error('Error al obtener la lista de juegos:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function obtenerJuegoSolicitado(juego) {
  try {
    let respuesta = await axios.post(
      IGDB_API_URL,
      `fields name, platforms.name, genres.name, themes.name, game_modes.name, first_release_date, release_dates.human, player_perspectives.name, involved_companies.company.name, game_engines.name; search "${juego}";`,
      {
        headers: {
          'Client-ID': CLIENT_ID,
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'text/plain'
        },
        httpsAgent
      }
    );
    return respuesta.data[0];
  } catch (error) {
    console.error('Error al obtener el juego solicitado:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function main() {
  let juegoAleatorio = await obtenerListaJuegos();

  if (!juegoAleatorio) {
    console.log('No se pudo obtener un juego aleatorio.');
    return;
  }

  let plataformaAleatoria = juegoAleatorio.platforms ? juegoAleatorio.platforms.map(platform => platform.name) : [];
  let generosAleatorio = juegoAleatorio.genres ? juegoAleatorio.genres.map(genre => genre.name) : [];
  let temasAleatorios = juegoAleatorio.themes ? juegoAleatorio.themes.map(theme => theme.name) : [];
  let modosDeJuegoAleatorios = juegoAleatorio.game_modes ? juegoAleatorio.game_modes.map(mode => mode.name) : [];
  let perspectivasAleatorias = juegoAleatorio.player_perspectives ? juegoAleatorio.player_perspectives.map(perspective => perspective.name) : [];
  let fechaLanzamientoAleatoria = juegoAleatorio.first_release_date ? new Date(juegoAleatorio.first_release_date * 1000).getFullYear() : 'Desconocido';
  let desarrolladoresAleatorios = juegoAleatorio.involved_companies ? juegoAleatorio.involved_companies.map(company => company.company.name) : [];
  let motorAleatorio = juegoAleatorio.game_engines ? juegoAleatorio.game_engines.map(engine => engine.name) : [];

    
  let intentos = 0;

  const jugar = async () => {
    rl.question('Elige un Juego: ', async (juego) => {
      let juegoElegido = await obtenerJuegoSolicitado(juego);

      if (!juegoElegido) {
        console.log('Juego no encontrado.');
        jugar();
        return;
      }

      let plataformaElegida = juegoElegido.platforms ? juegoElegido.platforms.map(platform => platform.name) : [];
      let generosElegido = juegoElegido.genres ? juegoElegido.genres.map(genre => genre.name) : [];
      let temasElegido = juegoElegido.themes ? juegoElegido.themes.map(theme => theme.name) : [];
      let modosDeJuegoElegido = juegoElegido.game_modes ? juegoElegido.game_modes.map(mode => mode.name) : [];
      let perspectivasElegido = juegoElegido.player_perspectives ? juegoElegido.player_perspectives.map(perspective => perspective.name) : [];
      let fechaLanzamientoElegida = juegoElegido.first_release_date ? new Date(juegoElegido.first_release_date * 1000).getFullYear() : 'Desconocido';
      let desarrolladoresElegidos = juegoElegido.involved_companies ? juegoElegido.involved_companies.map(company => company.company.name) : [];
      let motorElegido = juegoElegido.game_engines ? juegoElegido.game_engines.map(engine => engine.name) : [];

      if (juegoElegido.name === juegoAleatorio.name) {
        rl.close();
        console.log('¡Ganaste!');
        return;
      } else {
        let coincidenciaGeneros = generosElegido.filter(category => generosAleatorio.includes(category));
        let coincidenciaPlataforma = plataformaElegida.filter(platform => plataformaAleatoria.includes(platform));
        let coincidenciaTemas = temasElegido.filter(theme => temasAleatorios.includes(theme));
        let coincidenciaModosDeJuego = modosDeJuegoElegido.filter(mode => modosDeJuegoAleatorios.includes(mode));
        let coincidenciaPerspectivas = perspectivasElegido.filter(perspective => perspectivasAleatorias.includes(perspective));
        let coincidenciaFechaLanzamiento = fechaLanzamientoElegida === fechaLanzamientoAleatoria;
        let coincidenciaDesarrolladores = desarrolladoresElegidos.filter(company => desarrolladoresAleatorios.includes(company));
        let coincidenciaMotor = motorElegido.filter(engine => motorAleatorio.includes(engine));

        let resultadoGenero = generosElegido.length > 0
          ? (coincidenciaGeneros.length === generosElegido.length ? 'Verde' : 'Amarillo')
          : 'Rojo';

        let resultadoPlataforma = plataformaElegida.length > 0
          ? (coincidenciaPlataforma.length === plataformaElegida.length ? 'Verde' : 'Amarillo')
          : 'Rojo';

        let resultadoTemas = temasElegido.length > 0
          ? (coincidenciaTemas.length === temasElegido.length ? 'Verde' : 'Amarillo')
          : 'Rojo';

        let resultadoModosDeJuego = modosDeJuegoElegido.length > 0
          ? (coincidenciaModosDeJuego.length === modosDeJuegoElegido.length ? 'Verde' : 'Amarillo')
          : 'Rojo';

        let resultadoPerspectivas = perspectivasElegido.length > 0
          ? (coincidenciaPerspectivas.length === perspectivasElegido.length ? 'Verde' : 'Amarillo')
          : 'Rojo';

        let resultadoFechaLanzamiento = coincidenciaFechaLanzamiento ? 'Verde' : 'Rojo';
        let resultadoDesarrolladores = desarrolladoresElegidos.length > 0
          ? (coincidenciaDesarrolladores.length === desarrolladoresElegidos.length ? 'Verde' : 'Amarillo')
          : 'Rojo';

        let resultadoMotor = motorElegido.length > 0
          ? (coincidenciaMotor.length === motorElegido.length ? 'Verde' : 'Amarillo')
          : 'Rojo';


        console.log(`Generos: ${resultadoGenero}`);
        console.log(`Plataforma: ${resultadoPlataforma}`);
        console.log(`Temas: ${resultadoTemas}`);
        console.log(`Modos de Juego: ${resultadoModosDeJuego}`);
        console.log(`Perspectivas: ${resultadoPerspectivas}`);
        console.log(`Fecha de Lanzamiento: ${resultadoFechaLanzamiento}`);
        console.log(`Desarrolladores: ${resultadoDesarrolladores}`);
        console.log(`Motor: ${resultadoMotor}`);
        intentos++;
        console.log(`Intentos: ${intentos}`);

        if (intentos < 5) {
          jugar(); 
        } else {
          rl.close();
          console.log('Perdiste! El juego era:', juegoAleatorio.name);
        }
      }
    });
  };

  jugar();
}

main();
