import { NextResponse } from "next/server";

function handler(req, res) {
//   const date = new Date();
//   date.setUTCHours(0); // Set hours to zero

  // Now, when comparing dates, you can ignore the time component
  const currentDate = new Date(); // Current date and time
  console.log(currentDate);
  console.log(currentDate.getDate())
  console.log(currentDate.getMonth() + 1)
  const comparisonDate = '2022/04/01'; // A specific date
  const date = new Date(comparisonDate)
  console.log(date);
  console.log(date.getMonth() + 1)
  console.log(date.getDate())

  return new NextResponse('success')
}

export {handler as GET};
