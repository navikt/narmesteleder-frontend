import {Button} from "@navikt/ds-react";
import styles from "./page.module.css";
import {ThumbUpIcon} from "@navikt/aksel-icons";
import {PageBlock} from "@navikt/ds-react/Page";

export default function Home() {
    return (
        <main>
            <PageBlock width="md" gutters>
                <Button
                    icon={<ThumbUpIcon title="a11y tittel" />}
                    className={styles.limeButton}
                >
                    Knapp
                </Button>
            </PageBlock>
        </main>
    );
}