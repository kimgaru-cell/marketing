const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event, context) {
  const body = JSON.parse(event.body);
  const { text } = body;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `다음 뉴스 내용을 요약해 주세요 (3줄 이내) 그리고 핵심 키워드 5개를 추출해 주세요:\n\n${text}`;

  try {
    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: gptResponse.data.choices[0].message.content,
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
