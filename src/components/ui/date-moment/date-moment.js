import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "moment/locale/fr";
import "moment/locale/zh-cn"; 
import "moment/locale/vi";
import "moment/locale/km";
import "moment/locale/th";
import "moment/locale/en-gb";

import moment from "moment"; 

const DateMoment = ({date = new Date().toISOString() , format ="LLL" }) => { 
    const language = useSelector((state) => state.app.language)
    const [changeLanguage, setChangeLanguage] = useState(language)
    const [dateTime, setDateTime] = useState(null)
    const [dateMoment, setDateMoment] = useState(null)

    useEffect(() => {
        if(format === "LTS"){
            setChangeLanguage(language)
            setInterval(() => { 
                setDateMoment(moment().locale(language).format("LTS"))
            }, 1000)
        } else if (date !== dateTime || changeLanguage != language) {
            setChangeLanguage(language)
            setDateTime(date) 
            setDateMoment(moment(date).locale(language).format(format))
        }
    }, [date, language])

    return dateMoment;
}

export default DateMoment;
