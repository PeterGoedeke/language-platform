const axios = require('axios')
const validate = require('./validation')
const Translation = require('mongoose').model('Translation')

/**
 * Makes a request for a translation. First checks to see whether the translation exists in the cache and if it does
 * not then a request to the linguatools api is made and the result is returned and cached.
 * @param {String} l1 The language to be translated from
 * @param {String} l2 The language to be translated to
 * @param {String} query The word to be translated
 * @param {String} wordClass The grammatical type of the word
 */
async function makeRequest(l1, l2, query, wordClass) {
    // check the cache
    const cachedAnswer = await retrieveFromCache(query, l1)
    if(cachedAnswer) {
        return {
            fromCache: true,
            data: cachedAnswer
        }
    }
    // make sure that the query is in the right format for the linguatools api
    const validationResult = validate.isInvalidQuery({
        l1, l2, query, wordClass
    })
    // return the error if it's not
    if(validationResult) return validationResult

    // request the translation with axios
    try {
        const response = await axios.get(process.env.LINGUATOOLS_URI_FREE, {
            params: {
                langpair: `${l1}-${l2}`,
                query: query,
                wortart: wordClass
            },
            // required headers for rapidapi
            headers: {
                'x-rapidapi-host': 'petapro-translate-v1.p.rapidapi.com',
                'x-rapidapi-key': process.env.LINGUATOOLS_API_KEY
            }
        })
        // process the data slightly, as the linguatools response is an a weird format
        if(response.data) {
            response.data.forEach(data => {
                data.language1 = l1
                data.language2 = l2
                data.synonyme1 = data.synonyme1.split(',').map(w => w.trim())
                data.synonyme2 = data.synonyme2.split(',').map(w => w.trim())
                cacheTranslation(data)
            })
        }
        return response
    }
    catch (err) {
        return err
    }
}

/**
 * Validates the translation before caching it for later retrieval. Slightly reformats the translation as the linguatools
 * api returns the data in a strange format
 * @param {Object} translation The linguatools translation to be cached
 */
async function cacheTranslation(translation) {
    if(!validate.isTranslation(translation)) {
        console.log('Attempted to cache non-translation.')
        return
    }
    try {
        const newTranslation = new Translation({
            id: translation.id,
            // swapped around because linguatools returns them in backwards order
            l1_text: translation.l2_text,
            l2_text: translation.l1_text,
            wortart: translation.wortart,
            // not swapped around because linguatools returns these in expected order
            synonyme1: translation.synonyme1,
            synonyme2: translation.synonyme2,
            freq: translation.freq,
            // not swapped because these properties are not from linguatools
            language1: translation.language1,
            language2: translation.language2
        })
        await newTranslation.save()
    }
    catch (err) {
        console.log(err)
    }
}

/**
 * Retrieves a translation from the cache for the specified word if it can be found
 * @param {String} word The word for which the translation should be retrieved
 * @param {String} language The language to which the word belongs
 */
async function retrieveFromCache(word, language) {
    const translation = await Translation.findOne({
        $or: [
            {
                $and: [
                    {
                        language1: language
                    },
                    {
                        $or: [
                            {
                                l1_text: word
                            },
                            {
                                synonyme1: word
                            }
                        ]
                    }
                ]
            },
            {
                $and: [
                    {
                        language2: language
                    },
                    {
                        $or: [
                            {
                                l2_text: word
                            },
                            {
                                synonyme2: word
                            }
                        ]
                    }
                ]
            }
        ]
    })
    return translation
}

module.exports = makeRequest