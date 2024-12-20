import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const downloadMapping = (stringifiedJSON: string) => {

    // Create a blob from the JSON string
    const blob = new Blob([stringifiedJSON], { type: "application/json" });

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "secret-santa-mapping.json";

    // Programmatically click the anchor to trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up the DOM
    document.body.removeChild(a);
}


const CreateClique = () => {

    const [cliqueSize, setCliqueSize] = useState(0);
    const [cliqueName, setCliqueName] = useState('');
    const [errors, setErrors] = useState({cliqueNameError: false, 
                                          cliqueSizeError: false,
                                          cliqueInvalidError: false,
                                          cliqueDataError: false,
                                          cliqueCreateError: false});
    
    const [members, setMembers] = useState<Array<string>>([]);
    const [publicKeys, setPublicKeys] = useState<Array<string>>([]);

    const infoRef = useRef<HTMLDialogElement|null>(null);
    const resultRef = useRef<HTMLDialogElement|null>(null);

    const navigate = useNavigate();
    const [cliqueURL, setCliqueURL] = useState('');

    const createClique = async () => {
        if(cliqueName.length >= 12 && cliqueSize >= 3 && cliqueSize <= 25) {
            for(let ind = 0; ind < cliqueSize; ind++) {
                if(!members[ind].length || !publicKeys.length) {
                    setErrors({...errors, cliqueInvalidError: false, cliqueDataError: true});
                    return;
                }
            }
            
            setErrors({...errors, cliqueInvalidError: false, cliqueDataError: false});
            const clique = {clique: {name: cliqueName, members: members, publicKeys: publicKeys}};
            console.log(clique);

            const res = await fetch("https://i94t9etex2.execute-api.us-east-1.amazonaws.com/createSecretSantaClique", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clique)
            });

            console.log(res.status)
            if(res.status === 200) {
                const result = await res.json();
                downloadMapping(JSON.stringify(result));
                setCliqueURL(result.cliqueURL)
                resultRef.current?.showModal();
                return;
            }
            
            setErrors({...errors, cliqueCreateError: true});
            const result = await res.json();
            console.log(result);

        }
        setErrors({...errors, cliqueInvalidError: true});
    }

  return (
    <div className="my-3 p-3">
        <h1 className="text-3xl font-semibold m-5">Pick a name for your Clique</h1>
        <div className="m-auto flex flex-col w-1/3 min-w-[200px] mb-10">
            <input className="bg-[#27272A80] py-2 px-3 rounded-xl"
                    type="text"
                    placeholder="Your clique Name"
                    onChange={(e) => {
                        setCliqueName(e.target.value);
                        setErrors({ ...errors, cliqueNameError: e.target.value.length < 12});
                    }}
                />
            {errors.cliqueNameError && <p className="error my-1">The clique name must be atleast 12 characters long</p>}
        </div>

        <h1 className="text-3xl font-semibold m-5">Choose the size of your Clique</h1>
        <div className="m-auto flex flex-col w-1/3 max-w-[1300px] min-w-[200px] mb-10">
            <input className="bg-[#27272A80] py-2 px-3 rounded-xl"
                    type="number"
                    min={3}
                    max={25}
                    placeholder="Between 3 and 25"
                    onChange={(e) => {
                        // const currSize = cliqueSize;
                        const size = parseInt(e.target.value); 
                        
                        if(size < 3 || size > 25 || isNaN(size)) {
                            setErrors({...errors, cliqueSizeError : true});
                            return;
                        }
                        setCliqueSize(size);
                        setErrors({...errors, cliqueSizeError : false});
                        setMembers(new Array(size).fill(''));
                        setPublicKeys(new Array(size).fill(''));
                        
                        console.log("After: ", members, publicKeys);

                    }}
                />
            {errors.cliqueSizeError && <p className="error my-1">The clique must have between 3 to 25 members</p>}
        </div>

        <h1 className="text-3xl font-semibold m-5">
        Enter names and <span className="important hover:cursor-pointer underline"
                                  onClick={() => {
                                    infoRef.current?.showModal();
                                  }}>Public Keys</span>
        </h1>

        <div className="m-auto max-w-[550px] min-w-[200px]">
            {(!errors.cliqueSizeError && cliqueSize > 0) &&
             new Array(cliqueSize).fill(0).map((_, ind) => 
             <details open key={ind} 
                  className={`bg-[#100f0f] p-3 my-3`}>
                <summary className={`text-start text-xl ${members[ind].length && publicKeys[ind].length ? "important" : ""}`}>
                    <strong>Member-{ind+1}</strong>
                </summary>
                <div>
                    <label className="font-semibold text-start block">Name:</label>
                    <input type="text" className="p-1 rounded-lg w-full text-sm" 
                            onChange={(e) => {setMembers([...members.slice(0, ind), e.target.value, ...members.slice(ind+1,)])}}
                            value={members[ind]}/>
                </div>

                <div>
                    <label className="font-semibold text-start block">Public Key:</label>
                    <textarea className="font-mono p-1 bg-[#27272A80] h-[190px] rounded-lg w-full text-sm"
                              onChange={(e) => {setPublicKeys([...publicKeys.slice(0, ind), e.target.value, ...publicKeys.slice(ind+1,)])}}
                              value={publicKeys[ind]}/>
                </div>

             </details>
            )}
        </div>

        <button onClick={createClique}>Create</button>
        {errors.cliqueInvalidError && <p className="error my-1">Ensure clique name and size are in order</p>}
        {errors.cliqueDataError && <p className="error my-1">Verify that all names and public keys are correct</p>}
        {errors.cliqueCreateError && <p className="error my-1">Failed to create Clique. Check again to ensure that the publics are corectly formatted (PEM format) everywhere</p>}

        <dialog ref={infoRef} className="w-1/2 min-w-[300px] overflow-scroll h-2/3 bg-[#181414] p-3 border-[1px] border-solid border-white">
            <div>
                <span className="block text-end clickable" onClick={() => {infoRef.current?.close()}}>🗙</span>
                
                <h1 className="text-3xl font-semibold mb-3">Public Key</h1>
                <p className="m-2 text-start">The public key must be a 2048-bit key in PEM format (Make sure you have the corresponding private key for decryption). You can generate a key-pair here <a href="https://emn178.github.io/online-tools/rsa/key-generator/"><strong className="underline important link">here</strong></a> (use PKCS#8 format). Here is an example of a public key in PEM format:</p>
                
                <div className="font-mono text-start p-4 text-wrap">
                -----BEGIN PUBLIC KEY-----<br/>
                <p className="wrap-anywhere">MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyH/z7uQ0HgWcuHtNloyO</p>
                <p className="wrap-anywhere">9tlOnsrpkftxAPbM9yCenS6pJBo7sgAPaJh9NbTxjZmQR62pXN6pdcmaid+GRJ4D</p>
                <p className="wrap-anywhere">E2eEzCON8kxIhA++H7wK7D6VKTfgl7uPENjBIHDdrU+SohcRImqgiyHFBDBXGnSy</p>
                <p className="wrap-anywhere">FSZlkAjZNPS7/2gT8U15NVJpC9A4C9Ip89Stlz2FvHVM/B2mKnPYv0THXPBirij8</p>
                <p className="wrap-anywhere">5zYndkfE961t8/MnvI6KYtMtrxJmnvklO4ea2tUNZEz9JzzT4xJMKYklCEJcI3PW</p>
                <p className="wrap-anywhere">K/hYNKCPEvVHT60/cmTpwetPok/jPsLW0Seq2f2y+FcWTSOIaXnooWzPOqV/ORog</p>
                <p className="wrap-anywhere">KQIDAQAB</p>
                -----END PUBLIC KEY-----
                </div>

            </div>
        </dialog>


        <dialog ref={resultRef} className="w-1/2 min-w-[270px] bg-[#181414] p-5 border-[1px] border-solid border-white">
            <div>
                <span className="block text-end clickable" onClick={() => {resultRef.current?.close()}}>🗙</span>
                <h1 className="text-4xl font-semibold mb-3">Created Clique Successfully!!</h1>
                <p className="text-start">Here is the <strong className="important underline link" onClick={() => {navigate(`/clique/${cliqueURL}`)}}>URL</strong> for your clique where you can find the Secret Santa Mapping. The <strong className="important">URL will only be active for 24 hours</strong> from now, so it is necessary that atleast one member of the clique saves a local copy of the mapping.</p>
                <br/>
                <p className="text-start">Each member uses their private keys to decrypt the cipher against their name and can hence will only know the member of the clique for whom they are the secret santa.</p>
            </div>
        </dialog>
    </div>
  )
}

export default CreateClique