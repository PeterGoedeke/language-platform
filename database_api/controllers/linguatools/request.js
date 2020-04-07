const axios = require('axios')
const validate = require('./validation')

/**
 * Makes a request to the linguatools api and returns the result
 * @param {String} l1 The language to be translated from
 * @param {String} l2 The language to be translated to
 * @param {String} query The word to be translated
 * @param {String} wordClass The grammatical type of the word
 */
async function makeRequest(l1, l2, query, wordClass) {
    const validationResult = validate({
        l1, l2, query, wordClass
    })
    if(validationResult) return validationResult

    try {
        const response = await axios.get(process.env.LINGUATOOLS_URI, {
            params: {
                langpair: `${l1}-${l2}`,
                query: query,
                wortart: wordClass
            }
        })
        return response
    }
    catch (err) {
        return err
    }
}

module.exports = makeRequest