import {useState} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import i18n from "../../utils/i18n"

export default function LocalChange() {

    const [lang, setLang] = useState(i18n.language);
    const handleChange = (item: any) => {
        i18n.changeLanguage(item.target.value);

        setLang(item.target.value)
        window.console.info(item.target.value)
    }
    return <>
        <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
            <InputLabel id="demo-simple-select-standard-label">language 语言</InputLabel>
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={lang}
                onChange={handleChange}
                label="language"
            >
                <MenuItem value={"en-US"}>English</MenuItem>
                <MenuItem value={"zh-CN"}>简体中文</MenuItem>
            </Select>
        </FormControl>
    </>
}