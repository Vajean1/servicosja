import { CircularProgress } from "@mui/material"
import styles from './page.module.css'

export default function Loading3() {
    return(
        <div className={styles.loading3}>
            <h4>Carregando</h4>
            <CircularProgress color="inherit"/>
        </div>
    )
}