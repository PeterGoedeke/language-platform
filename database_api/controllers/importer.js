const germanWords = require('../germanWords.json')
const validate = require('./validation')
const XRegExp = require('xregexp')
const translateWord = require('./linguatools/request')

function extractUniqueWords(text) {
    const regex = XRegExp("[^\\s\\p{Latin}]+", "g");
    text = XRegExp.replace(text, regex, '')
    text = text.replace(/\r?\n|\r/g, ' ')

    const words = text.split(' ')
    const uniqueWords = {}

    for(const word of words) {
        uniqueWords[word] = uniqueWords[word] + 1 || 1
    }

    const uniqueWordsArr = []
    for(const key in uniqueWords) {
        uniqueWordsArr.push({ word: key, freq: uniqueWords[key] })
    }
    return uniqueWordsArr
}

async function translateText(req, res) {
    if(!validate.isImporterRequest(req, res)) return

    if(req.params.l1 != 'de' && req.params.l1 != 'en') {
        return res.status(404).json('Language not supported')
    }

    let uniqueWords = extractUniqueWords(req.body.text)

    const notWords = []
    uniqueWords = uniqueWords.filter(word => {
        const isAWord = germanWords[word.word.toLowerCase()]
        if(!isAWord) {
            notWords.push(word)
        }
        return isAWord
    })

    const translations = []
    const failedTranslations = []
    for(let i = 0; i < uniqueWords.length; i++) {
        const translation = translateWord(req.params.l1, req.params.l2, uniqueWords[i].word)

        translations[i] = translation
    }
    const potentialSuccesses = await Promise.all(translations)

    const successes = []
    const failures = []
    for(let i = potentialSuccesses.length - 1; i >= 0; i--) {
        if(potentialSuccesses[i].fromCache) {
            successes.push({ wordData: potentialSuccesses[i], textFreq: uniqueWords[i].freq })
        }
        else if(potentialSuccesses[i].data.length) {
            successes.push({ wordData: potentialSuccesses[i].data, textFreq: uniqueWords[i].freq })
        }
        else {
            failures.push(uniqueWords[i])
        }
    }

    res.status(200).json({
        successes,
        notWords,
        failures
    })
}

module.exports = {
    translateText
}