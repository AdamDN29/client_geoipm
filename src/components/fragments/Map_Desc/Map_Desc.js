import React from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import separatorNumber from '../../../hook/separatorNumber';

export default function Map_Desc(props) {
  const { max, min, handleClickSet, dataType } = props;

  let roundedMax = max.toFixed(2);
  let roundedMin = min.toFixed(2);

  let text1 = "";
  let text2 = "";

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
          <p><span>{dataType} {`> ${text1}${roundedMax}` || '...'}{text2}</span> </p>  
        </div>
        <div>
          <div className={styles.between}/>
          <p> <span>{text1}{roundedMin || '...'} ≤ {dataType} ≤ {text1}{roundedMax || '...'}{text2}</span> </p>  
        </div>
        <div>
          <div className={styles.low}/>
          <p><span>{dataType} {`< ${text1}${roundedMin}` || '...'}{text2}</span></p>  
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