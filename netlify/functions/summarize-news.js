const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  const body = JSON.parse(event.body);
  const { text } = body;

  const prompt = `다음 뉴스 내용을 3줄로 요약하고, 핵심 키워드 5개를 추출해줘:\n\n${text}`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: chatCompletion.choices[0].message.content,
      }),
    };
  } catch (error) {
    console.error("OpenAI 요청 실패:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "요약 요청 실패" }),
    };
  }
};
