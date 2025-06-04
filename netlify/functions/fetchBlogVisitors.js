const axios = require('axios');
const { parseStringPromise } = require('xml2js');

exports.handler = async function (event) {
  const blogId = event.queryStringParameters.blogId;
  const visitUrl = `https://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blogId}`;

  try {
    const response = await axios.get(visitUrl);
    const xmlData = response.data;

    const parsed = await parseStringPromise(xmlData, { explicitArray: false });
    const visitors = parsed.visitors.visitor.map(v => ({
      date: v.$.id,
      count: Number(v.$.cnt)
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ visitors })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
