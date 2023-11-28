// 注解 https://www.cnblogs.com/libin-1/p/5888452.html

// 地图
// http://jingweidu.757dy.com/
export interface iPic {
    Make: string, //"NIKON CORPORATION",
    Model: string, // "NIKON Z 30",
    DateTime: string, //"2023:11:26 08:43:12",
    pDateTime?: string,
    ExposureTime: {
        denominator: number,
        numerator: number
    }; //0.004  曝光时间
    pExposureTime?: any;
    FNumber: {
        denominator: number,
        numerator: number
    }, // 光圈值 f/5
    pFNumber?: any;
    ISOSpeedRatings: number, // 感光度 ISO200
    FocalLengthIn35mmFilm: number, // 等效焦距
    FocalLength: number, // 焦距（建议取等效焦距）

    // --- GPS信息
    GPSLatitude: Array<number>, // 纬度 31, 11, 51.74
    GPSLongitude: Array<number>, // 经度 121, 26, 24.75
    GPSLatitudeRef: String, // N
    GPSLongitudeRef: String, // E

    // 手动添加
    SixGPS?: string; // 1
    TenGPS?: string; // 2
    ChaGPS?: string; // 3 xxx,xxx
    GPsArr?: Array<string>;
    GPSType?: number, // 1
    LogoUrl?: string,
    Scale?: number; // 清晰度
}

declare global {
    interface Window {
        html2canvas: Function;
        EXIF: any
    }
}