export const commonFunc = {
  // 날짜 포맷 함수
  getDateAndTime(date) {
    if(date !== null) {
      let hour = date.getHours()
      let minute = date.getMinutes()
      let fullDate = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
      return `${fullDate} ${hour}:${minute}`
    } else {
      return null
    }
  },
  // for 일반 js
  parseJwtToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
         
    return JSON.parse(jsonPayload);
  },
  // for 금액 콤마 표시
  getCurrency(value) {
    let num = new Number(value)
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
}
