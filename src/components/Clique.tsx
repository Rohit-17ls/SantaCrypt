import { useEffect, useState } from "react"

type MappingItem = {
    member: string;
    cipher: any;
}

const downloadMapping = (stringifiedJSON: string) => {

    // Create a blob from the JSON string
    const blob = new Blob([stringifiedJSON], { type: "txt" });

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "secret-santa-mapping.txt";

    // Programmatically click the anchor to trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up the DOM
    document.body.removeChild(a);
}

const hexEncode = (base64EncodedString: string) => {
    const str = atob(base64EncodedString);

    let hex, i;
    let result = "";

    for (i=0; i< str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += hex.length === 1 ? '0' + hex : hex;
    }

    return result;
}

const Clique = () => {

    const [isFetching, setIsFetching] = useState(true);
    const [failureMessage, setFailureMessage] = useState('');
    const [mappingDetails, setMappingDetails] = useState('');
    const [mapping, setMapping] = useState<Array<MappingItem>>([]);
    const [copyInd, setCopyInd] = useState(-1);

    const copyCipher = (cipher: string, ind: number) => {
        setCopyInd(ind);
        navigator.clipboard.writeText(cipher);

        setTimeout(() => {
            setCopyInd(-1);
        }, 1000);
    }

    useEffect(() => {

        const fetchCliqueDetails = async (cliqueID: string) => {
            const res = await fetch(`https://i94t9etex2.execute-api.us-east-1.amazonaws.com/getSecretSantaMapping?cliqueID=${cliqueID}`);
            setIsFetching(false);
            if(res.status !== 200) {
                setFailureMessage((await res.json()).body.message);
                return;
            }
            
            const result = await res.json();
            console.log(result);
            const secretSantaMapping = result.body.message;
            
            const mappingItems: Array<MappingItem> = [];
            Object.entries(secretSantaMapping).forEach((entry) => {
                const [member, cipher] = entry;
                mappingItems.push({member, cipher : hexEncode(cipher as string)});
            })

            setMapping(mappingItems);
            setMappingDetails(JSON.stringify(secretSantaMapping));
            console.log(result.body.message);
        }  

        const id:string = location.href.split('/clique/')[1];

        if(id.length === 64) {
            fetchCliqueDetails(id);
        }else {
            setIsFetching(false);
            setFailureMessage("Invalid Clique ID");
        }
    }, []);

  return (
    <div className="p-3">
        {isFetching && <div>Finding Clique details...</div>}
        {(!isFetching && failureMessage) && <div className="text-xl error">{failureMessage}</div>}

        {(!isFetching && !failureMessage) && 
            <div className='m-auto max-w-[800px] min-w-[200px] flex flex-col gap-4'>
                <h1 className="text-4xl">Secret Santa Mapping</h1>
                <p>Decrypt with private keys from (Choose the ECB/OAEP/SHA256 algorithm) <a href="https://emn178.github.io/online-tools/rsa/decrypt/"><strong className="important link underline">here</strong></a></p>
                
                <table className="w-fit max-w-fit min-w-[200px] overflow-x-scroll border-1 border-solid border-x-white">
                    <tbody>
                        <tr>
                            <td className="w-1/5 border-solid border-[1px] border-white border-r-0 font-bold text-xl">Member</td>
                            <td className="border-solid border-[1px] border-white font-bold text-xl">Cipher</td>
                        </tr>
                    

                    {mapping.map((ele, ind) =>  <tr key={ind}>
                                                    <td className="p-1 border-solid border-[1px] border-white border-r-0 border-t-0">
                                                        <strong>{ele.member}</strong>
                                                    </td>
                                                    <td className="font-mono text-start hover:cursor-pointer border-solid border-[1px] border-white border-t-0"
                                                        onClick={() => {copyCipher(ele.cipher, ind)}}
                                                    >
                                                        {copyInd !== ind && <p className="p-2">{ele.cipher}</p>}
                                                        {copyInd === ind && <p className="bg-[#181414] text-2xl p-2">Copied!</p>}
                                                    </td>
                                                </tr>)}
                    </tbody>
                </table>
                
                <button onClick={() => {downloadMapping(mappingDetails)}}>Download</button>
            </div>
        }

    </div>
  )
}

export default Clique