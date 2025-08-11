const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
 
function numberToCurrencyWords(amount, currency = "NGN") {
//if (amount === 0 ) return `Zero ${currency === "USD" ? "Dollars" : "Naira"}`;
if (isNaN(amount) || amount === 0) {
  return isNaN(amount) 
    ? "Invalid amount" 
    : `Zero ${currency === "USD" ? "Dollars" : "Naira"}`;
}
  const belowTwenty = [
    "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion"];

  // Currency labels based on type
  const majorUnit = currency === "USD" ? "Dollars" : "Naira";
  const minorUnit = currency === "USD" ? "Cents" : "Kobo";

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

  const [wholePart, fractionalPart] = amount.toFixed(2).split(".");
  let wholeWords = "";
  let fractionalWords = "";

  if (parseInt(wholePart, 10) > 0) {
    let whole = parseInt(wholePart, 10);
    let i = 0;
    while (whole > 0) {
      if (whole % 1000 !== 0) {
        wholeWords = helper(whole % 1000) + (thousands[i] ? " " + thousands[i] : "") + " " + wholeWords;
      }
      whole = Math.floor(whole / 1000);
      i++;
    }
    wholeWords = wholeWords.trim() + " " + majorUnit;
  }

  if (parseInt(fractionalPart, 10) > 0) {
    let fractional = parseInt(fractionalPart, 10);
    fractionalWords = helper(fractional) + " " + minorUnit;
  }

  if (wholeWords && fractionalWords) {
    return wholeWords + " and " + fractionalWords;
  } else if (wholeWords) {
    return wholeWords;
  } else {
    return fractionalWords;
  }
}
app.get('/convert', (req, res) => {
  const input = req.query.number;
  const currency = req.query.currency?.toUpperCase() || "NGN";

  // Reject if not a valid number format (integer or decimal)
  if (!/^\d+(\.\d+)?$/.test(input)) {
    return res.status(400).json({ error: 'Invalid input. Please provide a valid number.', words: "Invalid number" });
  }

  const number = parseFloat(input);
  const words = numberToCurrencyWords(number, currency);
  res.json({ number, currency, words });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/convert?number={number}&currency={currency}`);
});











//---------------------------------------- FUNCTION FOR NAIRA ONLY ------------------------------


// function numberToCurrencyWords(amount) {
//   if (amount === 0) return "Zero Naira";

//   const belowTwenty = [
//     "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
//     "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
//   ];
//   const tens = ["Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
//   const thousands = ["", "Thousand", "Million", "Billion"];

//   function helper(n) {
//     if (n === 0) return "";
//     else if (n < 20) return belowTwenty[n - 1] + " ";
//     else if (n < 100) return tens[Math.floor(n / 10) - 2] + (n % 10 !== 0 ? "-" + helper(n % 10).trim() : "");
//     else {
//       let remainder = n % 100;
//       return (
//         belowTwenty[Math.floor(n / 100) - 1] +
//         " Hundred" +
//         (remainder !== 0 ? " and " + helper(remainder).trim() : "")
//       );
//     }
//   }

//   const [nairaPart, koboPart] = amount.toFixed(2).split(".");
//   let nairaWords = "";
//   let koboWords = "";

//   if (parseInt(nairaPart, 10) > 0) {
//     let naira = parseInt(nairaPart, 10);
//     let i = 0;
//     while (naira > 0) {
//       if (naira % 1000 !== 0) {
//         nairaWords = helper(naira % 1000) + (thousands[i] ? " " + thousands[i] : "") + " " + nairaWords;
//       }
//       naira = Math.floor(naira / 1000);
//       i++;
//     }
//     nairaWords = nairaWords.trim() + " Naira";
//   }

//   if (parseInt(koboPart, 10) > 0) {
//     let kobo = parseInt(koboPart, 10);
//     koboWords = helper(kobo) + " Kobo";
//   }

//   if (nairaWords && koboWords) {
//     return nairaWords + " and " + koboWords;
//   } else if (nairaWords) {
//     return nairaWords;
//   } else {
//     return koboWords;
//   }
// }

// app.get('/convert', (req, res) => {
//   const number = parseFloat(req.query.number);

//   if (isNaN(number)) {
//     return res.status(400).json({ error: 'Invalid input. Please provide a valid number.' });
//   }

//   const words = numberToCurrencyWords(number);
//   res.json({ number, words });
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/convert?number={number}`);
// });
