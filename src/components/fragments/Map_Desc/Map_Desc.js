import React from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import separatorNumber from '../../../hook/separatorNumber';

export default function Map_Desc(props) {
  const { max, min, Q1, Q2, Q3, Q4, handleClickSet, dataType } = props;

  let roundedMax, roundedMin, roundedQ1, roundedQ2, roundedQ3, roundedQ4;

  if(max !== 0){
    roundedMax = max.toFixed(2);
    roundedMin = min.toFixed(2);
  }else{
    roundedQ1 = Q1.toFixed(5);
    roundedQ2 = Q2.toFixed(5);
    roundedQ3 = Q3.toFixed(5);
    roundedQ4 = Q4.toFixed(5);
  }

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
        {max !== 0 ? 
        (<>
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
        </>):(<>
            <div>
              <div className={styles.high}/>
              <p><span>{dataType} {`> ${text1}${roundedQ4}` || '...'}{text2}</span> </p>  
            </div>
            <div>
              <div className={styles.mid_high}/>
              <p> <span>{text1}{roundedQ3 || '...'} ≤ {dataType} ≤ {text1}{roundedQ4 || '...'}{text2}</span> </p>  
            </div>
            <div>
              <div className={styles.between}/>
              <p> <span>{text1}{roundedQ2 || '...'} ≤ {dataType} ≤ {text1}{roundedQ3 || '...'}{text2}</span> </p>  
            </div>
            <div>
              <div className={styles.mid_low}/>
              <p> <span>{text1}{roundedQ1 || '...'} ≤ {dataType} ≤ {text1}{roundedQ2 || '...'}{text2}</span> </p>  
            </div>
            <div>
              <div className={styles.low}/>
              <p><span>{dataType} {`< ${text1}${roundedQ1}` || '...'}{text2}</span></p>  
            </div> 
        </>)}
      </div>
    </div>
  )
}

Map_Desc.defaultProps = {
  max: 0,
  min: 0,
  Q1: 0,
  Q2: 0,
  Q3: 0,
  Q4: 0,
  handleClickSet: ()=>{}
};

Map_Desc.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  Q1: PropTypes.number,
  Q2: PropTypes.number,
  Q3: PropTypes.number,
  Q4: PropTypes.number,
  handleClickSet: PropTypes.func
}