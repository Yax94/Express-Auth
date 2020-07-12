import expressLoader from './express.js';
import mongooseLoader from './mongoose.js'

export default async (expressApp) => {

    expressLoader(expressApp)
    console.log("🔵 Express loaded")

    const db = await mongooseLoader(expressApp)
    console.log("🔵 Mongoose loaded")
}
