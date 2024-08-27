const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const url =
  "https://www.amazon.in/s?i=jewelry&bbn=5210079031&rh=n%3A1951048031%2Cn%3A5210079031%2Cn%3A7124358031%2Cn%3A2152555031%2Cp_72%3A1318476031%2Cp_85%3A10440599031&s=jewellery&hidden-keywords=-sponsored-coin-bar-925-sterling-giva-clara-pissara&pf_rd_i=5210079031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=f1120405-f6c5-460b-8e3e-c17d12cef4a3&pf_rd_r=GZSY1PM8WBRMFZK3NX41&pf_rd_s=merchandised-search-11&ref=QA6up10Expander_en_IN_1";

async function amazonScrapping() {
  try {
    const response = await axios.get(url);
    const data = [];
    const $ = cheerio.load(response.data);
    $(".a-price-whole").each((index, tag) => {
      data[index] = {};
      data[index].price = $(tag).text();
    });
    $(".a-size-base-plus.a-color-base").each((index, tag) => {
      if (!data[index]) {
        data[index] = {};
      }
      data[index].name = $(tag).text();
    });

    $(".a-icon-alt").each((index, tag) => {
      if (!data[index]) {
        data[index] = {};
      }
      data[index].rating = $(tag).text();
    });
    $(".a-color-base.a-text-bold").each((index, tag) => {
      if (!data[index]) {
        data[index] = {};
      }
      data[index].deliverBy = $(tag).text();
    });

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    xlsx.writeFile(workbook, "datas.xlsx");
    console.log("Data saved to data.xlsx", data);
  } catch (error) {
    console.log(error);
  }
}
amazonScrapping();
