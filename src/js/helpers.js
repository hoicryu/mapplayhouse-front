import moment from 'moment';

global.currency = function (data, options) {
  if (!data) return '0';
  else return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

global.enumT = (model_name, value) => {
  try {
    return i18next.t('enum')[model_name][value];
  } catch {
    return '모델명 혹은 값이 잘못되었습니다.';
  }
};

global.dateFormat = (date, format) => {
  try {
    return moment(date).format(i18next.t('date_formats')[format]);
  } catch (e) {
    console.log(e);
    return '시간이나 포맷이 잘못되었습니다.';
  }
};
