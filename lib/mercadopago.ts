import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno.');
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const mpPreference = new Preference(client);
export const mpPayment = new Payment(client);
