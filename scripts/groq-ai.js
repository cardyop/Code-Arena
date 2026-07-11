const Groq = require('groq-sdk')

const groq = new Groq({
    apiKey:'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',
    dangerouslyAllowBrowser: true
})

async function generateQuestion(level = 'beginner') {
    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: 'You are a coding quiz generator. Always respond with valid JSON only, no extra text.'
                },
                {
                    role: 'user',
                    content: `Generate a ${level} level multiple choice coding question. Respond with this exact JSON format:
{"question":"your question here","options":["option1","option2","option3","option4"],"correct":"A","difficulty":"${level}"}`
                }
            ],
            max_tokens: 200,
            temperature: 0.7
        })

        const text = response.choices[0].message.content.trim()
        console.log('Groq raw response:', text)
        return JSON.parse(text)

    } catch (err) {
        console.log('Groq error:', err)
        return null
    }
}