import React from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import separatorNumber from '../../../hook/separatorNumber';

export default function Map_Desc(props) {
  const { max, min, gwrflag, handleClickSet, dataType } = props;

  let roundedMax, roundedMin;
  let text1 = "";
  let text2 = "";
  let text3 = "";

  if(gwrflag){
    roundedMax = max.toFixed(5);
    roundedMin = min.toFixed(5);
    text3 = "Est ";
  }else{
    roundedMax = max.toFixed(3);
    roundedMin = min.toFixed(3);
  } 

  if(dataType === "PPD"){
    text1 = "Rp. "
    roundedMax = separatorNumber(roundedMax*1000);
    roundedMin = separatorNumber(roundedMin*1000);
  }
  else if(dataType === "UHH" || dataType === "AHLS" || dataType === "ARLS"){
    text1 = ""; text2= " Tahun";
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <p>Keterangan</p>
      </div>
      <div className={styles.desc}>
      <div>
            <div className={styles.high}/>
              <p><span>{text3}{dataType} {`> ${text1}${roundedMax}` || '...'}{text2}</span> </p>  
            </div>
            <div>
              <div className={styles.between}/>
              <p> <span>{text1}{roundedMin || '...'} ≤ {text3}{dataType} ≤ {text1}{roundedMax || '...'}{text2}</span> </p>  
            </div>
            <div>
              <div className={styles.low}/>
              <p><span>{text3}{dataType} {`< ${text1}${roundedMin}` || '...'}{text2}</span></p>  
            </div>
      </div>
    </div>
  )
}

Map_Desc.defaultProps = {
  max: 0,
  min: 0,
  handleClickSet: ()=>{}
};

Map_Desc.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  handleClickSet: PropTypes.func
}