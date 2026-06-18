import mongoose from 'mongoose'

export async function connecterDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI manquant. Renseigne-le dans le fichier .env (voir .env.example).')
  }

  await mongoose.connect(uri)
  console.log('Connecté à MongoDB Atlas')
}