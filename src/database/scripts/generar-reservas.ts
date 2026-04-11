import * as fs from 'fs';
import { randomInt } from 'crypto';

const fechaInicio = new Date(2025, 4, 6); // Inicia el 6 de mayo de 2025 (mes 4 es mayo, ya que los meses empiezan desde 0)
const fechaFin = new Date(fechaInicio);
fechaFin.setMonth(fechaFin.getMonth() + 6); // Añadir 6 meses

const horarios = [
  '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00',
]; // Bloques de 2 horas
const espacios = Array.from({ length: 410 - 201 + 1 }, (_, i) => 201 + i) // Aulas 201-410
  .concat(Array.from({ length: 507 - 501 + 1 }, (_, i) => 501 + i)) // Laboratorios 501-507
  .concat(Array.from({ length: 707 - 701 + 1 }, (_, i) => 701 + i)) // Laboratorios 701-707
  .concat(Array.from({ length: 607 - 601 + 1 }, (_, i) => 601 + i)); // Laboratorios 601-607

const totalReservas = 500; // Número total de reservas a generar (puedes ajustarlo según necesidad)
const reservas: string[] = [];

function generarFechaAleatoria() {
  const fecha = new Date(fechaInicio.getTime() + Math.random() * (fechaFin.getTime() - fechaInicio.getTime()));
  // Asegurarse de que sea un día laboral
  if (fecha.getDay() === 0 || fecha.getDay() === 6) {
    return generarFechaAleatoria(); // Si es fin de semana, repetir
  }
  return fecha;
}

function generarReserva() {
  const espacioId = espacios[randomInt(espacios.length)];
  const fecha = generarFechaAleatoria();
  const horaInicio = horarios[randomInt(horarios.length)];
  const horaFin = horarios[horarios.indexOf(horaInicio) + 1] || '20:00'; // El siguiente bloque de 2 horas

  // Formato: <idEspacio>;<fecha>;<horaInicio>;<horaFin>
  return `${espacioId};${fecha.toISOString().split('T')[0]};${horaInicio};${horaFin}`;
}

// Generar un número total de reservas aleatorias
for (let i = 0; i < totalReservas; i++) {
  reservas.push(generarReserva());
}

// Guardar el archivo reservas.txt
fs.writeFileSync('src/data/reservas.txt', reservas.join('\n'), 'utf-8');
console.log('Archivo reservas.txt generado con éxito');
