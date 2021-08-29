export default function getdatetime(param: string): string {
  const date = new Date();

  param.replace("i", ("00" + date.getHours()).slice(-2));
  param.replace("H", ("00" + date.getHours()).slice(-2));
  param.replace("d", ("00" + date.getDate()).slice(-2));
  param.replace("m", ("00" + (date.getMonth() + 1)).slice(-2));
  param.replace("Y", date.getFullYear().toString());

  return param;
}
