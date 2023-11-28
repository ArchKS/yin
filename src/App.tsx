import { useRef, useState } from "react";
import "./App.less"
import { iPic } from "./type";
import { Fraction, convertDMSToDD } from "./utils";
import { Ckbox, Loading, RangeBox, SelectFonts, SelectLayout } from "./compont";


// const defaultPxf: iPic = {
//   Make: "NIKON CORPORATION",
//   Model: "NIKON Z30",
//   DateTime: "2023:11:26 08:43:12",
//   ExposureTime: {
//     denominator: 2500,
//     numerator: 10
//   },
//   FNumber: {
//     denominator: 100,
//     numerator: 500
//   },
//   ISOSpeedRatings: 200,
//   FocalLength: 27.5,
//   FocalLengthIn35mmFilm: 41,
//   GPSLatitudeRef: "N",
//   GPSLatitude: [31, 11, 51.74],
//   GPSLongitudeRef: "E",
//   GPSLongitude: [121, 26, 24.75],
// }
/* 
    scale 下载清晰度
    element：
        设备具体型号
        品牌
        logo
        
        相机光圈快门
        时间，不同的格式
        地点，经纬度、可输入、请求API

    样式：
        1、底部元素
        2、字体
*/
function App() {
  const [PXF, setPXF] = useState<iPic>();
  const [Scale, setScale] = useState(10); // 清晰度
  const [oAxis, setOAxis] = useState(20);
  const [xAxis, setXAxis] = useState(1); // 水平间距
  const [yAxis, setYAxis] = useState(38);
  const [shadow, setShadow] = useState(2);
  const [brandFontFamily, setBff] = useState('');


  // 设置字体样式
  // const [Fonts, setFonts] = useState({
  //   fBrand: '',
  //   fTime: '',
  //   fShotParams: '',
  //   fGps: '',
  //   vGlobal: '',
  // });

  // 设置元素显示或隐藏
  const [c_VTime, setCVtime] = useState(true);
  const [c_VShotParams, setCVShotParams] = useState(true);
  // const [c_VLogo, setCVLogo] = useState(true);
  const [c_VGps, setCVGps] = useState(true);
  const [c_VDirection, setCvDirection] = useState("Horizontal"); // Vertical
  const [localImg, setLocalImg] = useState<string>(); // "https://z1.ax1x.com/2023/11/28/piBbG8A.png"

  // ref,用于设置字体、颜色等
  const inputRef = useRef(null);
  const infoRef = useRef(null);

  // const brandRef = useRef(null);
  // const timeRef = useRef(null);
  // const shotParamsRef = useRef(null);
  // const gpsRef = useRef(null);
  // const dotRef = useRef(null);



  const containerRef = useRef(null);



  // useEffect(() => {
  //   modifyPxf(defaultPxf);
  // }, [])


  const modifyPxf = (i: iPic) => {
    i.LogoUrl = '';

    if (i.ExposureTime.numerator % i.ExposureTime.denominator === 0) {
      i.pExposureTime = i.ExposureTime.numerator / i.ExposureTime.denominator
    } else {
      Fraction.fraction(i.ExposureTime.numerator, i.ExposureTime.denominator);
      Fraction.toFraction()
      i.pExposureTime = Fraction.toFraction();
    }

    if (i.FNumber.numerator % i.FNumber.denominator === 0) {
      i.pFNumber = i.FNumber.numerator / i.FNumber.denominator
    } else {
      Fraction.fraction(i.FNumber.numerator, i.FNumber.denominator);
      Fraction.toFraction()
      i.pFNumber = Fraction.toFraction();
    }


    if (!i.GPSLatitude) { // 如果有GPS信息，则设置GPS // 10进制、60进制、文字
      i.GPSLatitudeRef = "N";
      i.GPSLatitude = [31, 11, 51.74];
      i.GPSLongitudeRef = "E";
      i.GPSLongitude = [121, 26, 24.75];
    }
    let TenGps = `${convertDMSToDD(i.GPSLatitude, i.GPSLatitudeRef).toFixed(4)} ${convertDMSToDD(i.GPSLongitude, i.GPSLongitudeRef).toFixed(4)}`;
    // 40°3'13"N 116°19'25"E
    let [a1, a2, a3] = i.GPSLatitude; // 纬度
    let [b1, b2, b3] = i.GPSLongitude;
    let SixGps = `${a1}°${a2}'${a3.toFixed(0)}"${i.GPSLatitudeRef} &nbsp;&nbsp; ${b1}°${b2}'${b3.toFixed(0)}"${i.GPSLongitudeRef}`
    i.GPsArr = [TenGps, SixGps, ''];
    i.GPSType = 1;


    // 设置日期
    // PXF?.DateTime?.slice(0, PXF.DateTime.length - 3)
    let [y, M, d, h, m] = i.DateTime.split(/:| /)!;
    i.pDateTime = `${y}/${M}/${d} ${h}:${m}`;

    console.log(i);
    setPXF(i);
  }

  const toDisplayImg = () => {
    let file = (inputRef.current as any).files[0];
    let fileUrl = window.URL.createObjectURL(file)
    setLocalImg(fileUrl);
    window.EXIF.getData(file, function () {
      // @ts-ignore
      let i: iPic = window.EXIF.getAllTags(this);
      modifyPxf(i);
    });
  }


  const UploadCom = () => <div className="upload-component">
    <input type="file" name="file" id="file" className="select-image" onChange={toDisplayImg} ref={inputRef} />
    <label htmlFor="file" className="image-label">上传图片</label>
  </div>


  // 展示上传图片后的样式


  const downloadImg = () => {
    let component = document.querySelector(".upload-image") as HTMLDivElement;
    Loading();
    document.body.style.overflowY = 'hidden';

    setTimeout(() => {
      window.html2canvas(component, { scale: Scale, useCORS: false }).then((canvas: any) => {
        setTimeout(() => {
          let loadEl = document.getElementById("loading") as HTMLDivElement;
          document.body.removeChild(loadEl)
          document.body.style.overflowY = 'scroll'
        }, 2000);

        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'downloaded_image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }, 100);
  }

  return (
    <div className="App">
      <div className="upload-image">
        {
          localImg ? <div className="display-component" ref={containerRef}>
            <img src={localImg} id="specImg" alt="" style={{
              boxShadow: `${shadow}px ${shadow}px ${shadow * 4}px ${shadow * 2}px rgba(0,0,0,.15)`
            }} />
            <div className={`infomation ${c_VDirection}`} ref={infoRef} style={{
              margin: `${oAxis}px ${xAxis}px`
            }}>
              <div className="area-a left top" style={{
                height: `${yAxis}px`
              }}>
                <div className="device" style={{
                  fontFamily: brandFontFamily,
                  fontSize: '20px',
                }}>{PXF?.Model}</div>
                {
                  c_VTime && c_VDirection === "Horizontal" ? <div className="time">{PXF?.pDateTime}</div> : null
                }
              </div>

              <div className="area-b right bottom" style={{
                height: `${yAxis}px`
              }}>
                {
                  c_VTime && c_VDirection === "Vertical" ? <div className="time">{PXF?.DateTime?.slice(0, PXF.DateTime.length - 3)}</div> : null
                }

                {
                  c_VShotParams ? <div className="shot">
                    <div className="dot"></div>
                    <div className="text">
                      <div className="fc">{`${PXF?.FocalLength}mm`}</div>
                      <div>{`f/${PXF?.pFNumber}`}</div>
                      <div>{`${PXF?.pExposureTime}s`}</div>
                      <div>{`ISO${PXF?.ISOSpeedRatings}`}</div>
                    </div>

                  </div> : null
                }
                {
                  c_VGps && PXF && PXF.GPsArr ? <div className="gps" dangerouslySetInnerHTML={{ __html: PXF.GPsArr[PXF.GPSType!] }}></div> : null
                }
              </div>
            </div>
          </div> : <UploadCom />
        }
      </div>
      {
        localImg ? <div className="download-image" onClick={downloadImg}>下载图片</div> : null
      }
      <div className="operation">
        <div className="option visible">
          <div className="title">元素显示</div>
          <div className="display-wrapper">
            <Ckbox name="时间" checked={c_VTime} event={setCVtime} />
            {/* <Ckbox name="LOGO" checked={c_VLogo} event={setCVLogo} /> */}
            <Ckbox name="快门" checked={c_VShotParams} event={setCVShotParams} />
            <Ckbox name="经纬" checked={c_VGps} event={setCVGps} />
          </div>
        </div>

        <div className="option scale">
          <RangeBox name="精度控制" value={Scale} event={setScale} />
        </div>

        <div className="option xAxis">
          <RangeBox name="水平间距" value={xAxis} event={setXAxis} max={40} />
        </div>

        <div className="option oAxis">
          <RangeBox name="外间距" value={oAxis} event={setOAxis} max={40} />
        </div>
        <div className="option yAxis">
          <RangeBox name="内间距" value={yAxis} event={setYAxis} max={100} min={20} />
        </div>
        <div className="option shadow">
          <RangeBox name="阴影" value={shadow} event={setShadow} max={20} />
        </div>

        <div className="option fontset">
          <SelectFonts event={setBff} />
        </div>

        <div className="option layout">
          <SelectLayout event={setCvDirection} />
        </div>
      </div>
    </div>
  );
}

export default App;




