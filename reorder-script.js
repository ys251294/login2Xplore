'use strict';


function reorder(sentence) {

    let words = sentence.split(" ");
// console.log(words);

// for storing numbers present in words.

let numbers = [];

let len = -1;
while (++len < words.length) {
    for (let i = 0; i < words[len].length; i++) {
        let num = Number(words[len].charAt(i));
        if (num >= 1 && num <= 9) {
            numbers.push(num);
            words[len] = words[len].replace(num, '');
        }
    }
}
// console.log(numbers, words);

// Rearranging words to make proper sentences
let num=1;
let result="";
for(let i=0; i<9; i++){
    if(numbers[i]==num){
        result += words[i];
        num++;
        if(num>numbers.length) break;
        result += " ";
        i = -1;
    }
}
}