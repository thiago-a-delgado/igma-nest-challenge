export function IsValidCpf(cpf: string): boolean {

  // Checks the CPF length, which must be: 
  // 11 characters without mask or 14 characters with mask
  if (cpf.length !== 11 && cpf.length !== 14) {
    return false;
  }

  // Removing mask
  cpf = cpf.replace(/[^\d]+/g, '');

  // Checks if the informed CPF does not have all the same characters 
  if (cpf.length !== 11 || !Array.from(cpf).filter(e => e !== cpf[0]).length) {
    return false;
  }

  let sum = 0;
  let rest = 0;

  // Multiplies each of the first 9 digits of the CPF, 
  // from right to left by increasing numbers starting from number 2
  for (var i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  // Divides the result obtained by 11, considering only the integer value.
  rest = (sum * 10) % 11;

  // If the rest of the division is less than 2, then the digit is equal to 0.
  if ((rest == 10) || (rest == 11)){
    rest = 0;
  }

  // Checks if the first digit is corret
  if (rest != parseInt(cpf.substring(9, 10))) {
    return false;
  }

  // Same calculation, but now to the second digit
  // Multiplies each of the first 10 digits of the CPF, 
  // from right to left by increasing numbers starting from number 2  
  sum = 0;
  for (var i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  // Divides the result obtained by 11, considering only the integer value.
  rest = (sum * 10) % 11;

  // If the rest of the division is less than 2, then the digit is equal to 0.
  if ((rest == 10) || (rest == 11)) {
    rest = 0;
  }

  // Checks if the second digit is corret
  if (rest != parseInt(cpf.substring(10, 11))) {
    return false;
  }
  
  return true;
}