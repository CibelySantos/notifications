// Cibely Cristiny dos Santos

import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: 'ASIAV3QTLJ64Q3LCC23S',
  secretAccessKey: 'FIs3Aq6A1OWC7R7Wzj20nxFI6Hw5lSSzT9Hpn9id',
  sessionToken: 'IQoJb3JpZ2luX2VjEEcaCXVzLXdlc3QtMiJHMEUCIQCz+A8mUZGW8fv6UhVjab6wmumVvEL4hYyRZvI9tl9aJgIgXKuuFZ1eX8lR2i+d3dVi1tUSsSYNBpGQmcTqErjjv6MqvwII8P//////////ARABGgw0MDI2OTM3NzExOTMiDKl6zc/cbELKbnSDySqTAsA1kEoKzvZA/fBNV8WlWGYY+MnwsRagJp5rhE0DVJ0DmcSzRWPvwb09Sdz/Fy7TNM2NO+8B68Y1iPXXnoJ0rYQi1XI3G91IAxArIq8L2Yv+rQ7eZmLUcgyuBt+ynPHsJDIZOtWsJTdgFpVkQpv1Hx/UIkJgkY4Lp5HwaXbJ9jbhpQdvZyd4PAlLVup+Bkxj5q7Eg4ZVSOAhw6dmBr8NyzLGON/+Er+4zWU6S049mc/Fecv01npkX/P/+oTO4yJHZ5ysN+K/AwRB0kdzwZSxbqBzefk9SZ/HfKV33WJMWQafbRiQcOzJEpmduVSdYTZqfAdziRRr5sVFQ2eDIc2wUE2DqsOAnwN9MZlE+NVpvO/EOpo5MIyxjcEGOp0BNgGS/LUiFZGehC33Nd0ru8aOMnhi+wr3vVkLeyaEy7mlnwlIIL2h8Eocrt+fshToTl7MsJXW9tsrtfq7vkhdBcz4rkBphpudoqep1GmOuqBPg5cTegtweKAIc27sLUNjiglkxTjcEvxDQDZ/iMzkbRIZub7s6xBsUCkCbbxvzLGLLArSYEmx9eZHYDajEj/Rn7k/NQrIOaElHRIk/A==',
  region: 'us-east-1', 
  signatureVersion: 'v4',
});

export default s3;