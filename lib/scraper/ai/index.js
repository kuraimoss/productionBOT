const { OpenAI } = require("openai");

const client = new OpenAI({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: setting.huggingface.key,
});

async function chatGptOss120b(messages) {
    try {
        return await new Promise(async(resolve, reject) => {
            if (!messages) return reject("undefined reading messages input");
            if (!Array.isArray(messages)) return reject("invalid array input at messages!");
      
            let promptHistory = "";
      
            for (let dt of messages) {
                promptHistory += `\n${dt.role === "user" ? ("Human: " + dt.content) : dt.role === "assistant" ? ("Assistant: " + dt.content) : "" }`
            }
            
            client.responses.create({
                model: "openai/gpt-oss-120b",
                instructions: prompts,
                input: promptHistory
            })
                .then(respon => {
                    if (respon.status == "completed") {
                        resolve({ status: true, data: { answer: respon.output_text }})
                    } else {
                        reject(respon.error)
                    }
                })
                .catch(err => reject(err))
        })
    } catch(e) {
        return { status: false, message: e }
    }
}

module.exports = { chatGptOss120b }