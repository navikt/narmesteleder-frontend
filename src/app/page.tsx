import {Button} from "@navikt/ds-react";
import {ThumbUpIcon} from "@navikt/aksel-icons";
import {PageBlock} from "@navikt/ds-react/Page";

export default function Home() {
    return (
        <main>
            <PageBlock width="md" gutters>
                <Button
                    icon={<ThumbUpIcon title="a11y tittel" />}
                    variant="primary"
                >
                    Gjør noe!
                </Button>
            </PageBlock>
        </main>
    );
}