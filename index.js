const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Function to convert number to words
// function numberToWords(num) {
//     const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

//     if (num === 0) return 'Zero';

//     let words = '';

//     if (num >= 1000) {
//         words += units[Math.floor(num / 1000)] + ' Thousand ';
//         num %= 1000;
//     }

//     if (num >= 100) {
//         words += units[Math.floor(num / 100)] + ' Hundred ';
//         num %= 100;
//     }

//     if (num >= 20) {
//         words += tens[Math.floor(num / 10)] + ' ';
//         num %= 10;
//     } else if (num >= 10) {
//         words += teens[num - 10] + ' ';
//         num = 0;
//     }

//     if (num > 0) {
//         words += units[num] + ' ';
//     }

//     return words.trim();
// }

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
  
  
  
    // Convert integer part (Naira) and decimal part (Kobo)
  
    const [nairaPart, koboPart] = amount.toFixed(2).split(".");
  
  
  
    let nairaWords = "";
  
    let koboWords = "";
  
  
  
    // Process Naira
  
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
  
  
  
    // Process Kobo
  
    if (parseInt(koboPart, 10) > 0) {
  
      let kobo = parseInt(koboPart, 10);
  
      koboWords = helper(kobo) + " Kobo";
  
    }
  
  
  
    // Combine Naira and Kobo
  
    if (nairaWords && koboWords) {
  
      return nairaWords + " and " + koboWords;
  
    } else if (nairaWords) {
  
      return nairaWords;
  
    } else {
  
      return koboWords;
  
    }
  
  }
  
  
// API Endpoint
app.post('/convert', (req, res) => {
    const { number } = req.body;

    if (typeof number !== 'number' || isNaN(number)) {
        return res.status(400).json({ error: 'Invalid input. Please provide a valid number.' });
    }
    const words = numberToCurrencyWords(number);
    // const words = numberToWords(number);
    res.json({ number, words });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});