// Configuración de Babel, la herramienta que traduce el JSX y el JS moderno que
// escribimos a algo que React Native pueda correr en el celular.

module.exports = function (api) {
  // Le decimos a Babel que cachee esta config para que compilar sea más rápido.
  api.cache(true);

  return {
    // Acá va el preset oficial de Expo, que trae todo lo necesario para
    // React Native + JSX. Ojo que la clave se llama "presets" (con "s"),
    // estaba mal escrita como "presents" y por eso el preset nunca se
    // aplicaba, lo corregí.
    presets: ["babel-preset-expo"],

    plugins: [
      [
        // Este plugin es el que permite hacer "import { API_KEY } from '@env'"
        // y que Babel lo reemplace por los valores reales del archivo .env.
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          // De acá saca los valores reales. Este .env no se sube al repo
          // (está en .gitignore), cada uno crea el suyo copiando .env.example.
          path: ".env",
        },
      ],
    ],
  };
};
