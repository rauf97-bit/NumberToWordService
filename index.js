const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function numberToCurrencyWords(amount) {
  if (amount === 0) return "Zero Naira";

  const belowTwenty = [
    "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion"];

  function helper(n) {
    if (n === 0) return "";
    else if (n < 20) return belowTwenty[n - 1] + " ";
    else if (n < 100) return tens[Math.floor(n / 10) - 2] + (n % 10 !== 0 ? "-" + helper(n % 10).trim() : "");
    else {
      let remainder = n % 100;
      return (
        belowTwenty[Math.floor(n / 100) - 1] +
        " Hundred" +
        (remainder !== 0 ? " and " + helper(remainder).trim() : "")
      );
    }
  }

  const [nairaPart, koboPart] = amount.toFixed(2).split(".");
  let nairaWords = "";
  let koboWords = "";

  if (parseInt(nairaPart, 10) > 0) {
    let naira = parseInt(nairaPart, 10);
    let i = 0;
    while (naira > 0) {
      if (naira % 1000 !== 0) {
        nairaWords = helper(naira % 1000) + (thousands[i] ? " " + thousands[i] : "") + " " + nairaWords;
      }
      naira = Math.floor(naira / 1000);
      i++;
    }
    nairaWords = nairaWords.trim() + " Naira";
  }

  if (parseInt(koboPart, 10) > 0) {
    let kobo = parseInt(koboPart, 10);
    koboWords = helper(kobo) + " Kobo";
  }

  if (nairaWords && koboWords) {
    return nairaWords + " and " + koboWords;
  } else if (nairaWords) {
    return nairaWords;
  } else {
    return koboWords;
  }
}

// ✅ Convert to GET-based API
app.get('/convert', (req, res) => {
  const number = parseFloat(req.query.number);

  if (isNaN(number)) {
    return res.status(400).json({ error: 'Invalid input. Please provide a valid number.' });
  }

  const words = numberToCurrencyWords(number);
  res.json({ number, words });
});

// Start server
app.listen(port, () => {
  console.log(`GET-based server running at http://localhost:${port}/convert?number=10000000`);
});
