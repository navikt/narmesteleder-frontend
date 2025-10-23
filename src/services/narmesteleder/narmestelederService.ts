import {getServerEnv, isLocalOrDemo} from "@/constants/envs";
import {exchangeIdportenTokenForNarmestelederBackendTokenx, verifyUserLoggedIn} from "@/auth/tokenUtils";

const backendUrl = getServerEnv().NARMESTELEDER_BACKEND_URL;

type Leder = {
    fnr: string;
    mobil: string;
    epost: string;
    fornavn: string,
    etternavn: string,
}

type NarmesteLederRequest = {
    sykmeldtFnr: string;
    organisasjonsnummer: string;
    leder: Leder;
}

export async function registerNarmesteleder(): Promise<string> {
    if(isLocalOrDemo) {
        return "test-post-narmesteleder";
    }

    const postPath = `${backendUrl}/api/v1/narmesteleder`;
    const idPortenToken = await verifyUserLoggedIn();
    const oboToken = await exchangeIdportenTokenForNarmestelederBackendTokenx(idPortenToken);

    const requestBody: NarmesteLederRequest = {
        sykmeldtFnr: "26095514420",
        organisasjonsnummer: "963890095",
        leder: {
            fnr: "19048938755",
            mobil: "99988877",
            fornavn: "John",
            etternavn: "Petrucci",
            epost: "john.petrucci@guitarhero.com"
        }
    };

    const response = await fetch(postPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${oboToken}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`Failed to register narmesteleder: ${response.statusText}`);
    }

    return await response.text();
}