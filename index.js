const fs = require("fs").promises;

const getSum = (k, index, soma) =>
  k < index ? getSum((k = k + 1), index, (soma = k + soma)) : soma;

const isFibonacci = (n, a = 0, b = 1) =>
  n === a ? true : n < a ? false : isFibonacci(n, b, a + b);

const getRevenue = async () => {
  try {
    const data = await fs.readFile("./faturamento.json", "utf-8");
    const json = JSON.parse(data);
    const daysWithRevenue = json.filter((item) => item.valor > 0);
    const { minRevenue, maxRevenue } = daysWithRevenue.reduce(
      (acc, item) => {
        if (item.valor < acc.minRevenue) acc.minRevenue = item.valor;
        if (item.valor > acc.maxRevenue) acc.maxRevenue = item.valor;
        return acc;
      },
      { minRevenue: Infinity, maxRevenue: -Infinity }
    );
    const revenueSum = daysWithRevenue.reduce(
      (acc, item) => acc + item.valor,
      0
    );
    const averageRevenue = revenueSum / daysWithRevenue.length;
    const daysAboveAverage = daysWithRevenue.filter(
      (item) => item.valor > averageRevenue
    ).length;
    return { minRevenue, maxRevenue, daysAboveAverage };
  } catch (err) {
    console.error("Algo deu errado ao desserializar o JSON", err);
  }
};

const STATES_REVENUE = {
  SP: 67836.43,
  RJ: 36678.66,
  MG: 29229.88,
  ES: 27165.48,
  Others: 19849.53,
};

const getStateRevenuePercentage = () => {
  const states = Object.keys(STATES_REVENUE);
  const revenues = Object.values(STATES_REVENUE);
  const totalRevenue = revenues.reduce((acc, value) => acc + value, 0);
  const percentages = states.map((state, index) => {
    const percentage = (revenues[index] / totalRevenue) * 100;
    return { state, percentage: percentage.toFixed(2) };
  });
  return percentages;
};

const invertString = (string) => string.length <= 1 ? string : string.charAt(string.length - 1) + invertString(string.slice(0, string.length - 1));