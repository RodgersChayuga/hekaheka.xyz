import { useCallback, useEffect, useState } from "react";
import type { Hex } from "viem";
import { useAccount, useConnect, usePublicClient, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { cbWalletConnector } from "@/wagmi";
import CustomButton from "./CustomButton";

export function ConnectAndSIWE() {
    const { connect } = useConnect({
        mutation: {
            onSuccess: (data) => {
                const address = data.accounts[0];
                const chainId = data.chainId;
                const m = new SiweMessage({
                    domain: document.location.host,
                    address,
                    chainId,
                    uri: document.location.origin,
                    version: "1",
                    statement: "Smart Wallet SIWE Example",
                    nonce: "12345678",
                });
                setMessage(m);
                signMessage({ message: m.prepareMessage() });
            },
        },
    });
    const account = useAccount();
    const client = usePublicClient();
    const [signature, setSignature] = useState<Hex | undefined>(undefined);
    const { signMessage } = useSignMessage({
        mutation: { onSuccess: (sig) => setSignature(sig) },
    });
    const [message, setMessage] = useState<SiweMessage | undefined>(undefined);

    const [valid, setValid] = useState<boolean | undefined>(undefined);

    const checkValid = useCallback(async () => {
        if (!signature || !account.address || !client || !message) return;

        client
            .verifyMessage({
                address: account.address,
                message: message.prepareMessage(),
                signature,
            })
            .then((v) => setValid(v));
    }, [signature, account]);

    useEffect(() => {
        checkValid();
    }, [signature, account]);

    useEffect(() => { });

    return (
        <div>
            <CustomButton onClick={() => connect({ connector: cbWalletConnector })}>
                {valid != undefined ? <p> Connected</p> : <p>Connect</p>}
            </CustomButton>
        </div>
    );
}