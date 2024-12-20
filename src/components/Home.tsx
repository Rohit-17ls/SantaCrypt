import { useNavigate } from "react-router-dom"

const Home = () => {

    const navigate = useNavigate();

  return (
    <section className="h-fit mt-[50px] mx-auto p-4 max-w-[1200px] min-w-[290px]">
        <h1 className="text-5xl font-bold my-5">SantaCrypt - Secret Santa for cliques</h1>
        <p className="text-3xl text-start">
            Create your <strong className="link important underline" onClick={() => navigate("/create")}>Clique</strong> and exchange gifts with ease. <strong className="important">No login/signup required.</strong> Quit having to draw from a jar of names or signing up with your email elsewhere.</p>

        <h2 className="text-3xl text-start font-bold mt-[60px] mb-3">How it works?</h2>
        <p className="text-lg text-start">So, basically a cryptographic solution that uses RSA encryption is employed to allow the secret santa mapping to be created (thanks to <a href="https://github.com/tharun-rs"><strong className="link important underline">@Tharun RS</strong></a> for the idea). One of the members of the clique (let's call them the clique leader) begins with a list of the clique members and their corresponding RSA public keys. A key-pair can be generated from <a href="https://emn178.github.io/online-tools/rsa/key-generator/"><strong className="underline important link">here</strong></a> (use PKCS#8 format). A mapping that is kept secret is generated such that each member's name maps to the RSA-encrypted name of another clique member for whom they will be the secret santa.</p>
        
        <p className="text-lg text-start my-5">This encrypted mapping is returned to the leader and also persisted for a while on this site for reference. This list can be used by each member to decrypt (using their private key, which only they have access to) the ciphertext that their name maps to. As mentioned earlier, this ciphertext is the encrypted form name of the member for whom they are the secret santa. Below is an illustration of what the encrypted mapping would look like:</p>

        <table className="w-fit mx-auto my-5 max-w-[800px] min-w-[200px] overflow-x-scroll border-1 border-solid border-x-white">
          <tbody>
            <tr>
              <td className="w-1/4 border-solid border-[1px] border-white border-r-0 font-bold text-xl">Member</td>
              <td className="border-solid border-[1px] border-white font-bold text-xl">Cipher</td>
            </tr>
            
            <tr>
              <td className="p-1 border-solid border-[1px] border-white border-r-0 border-t-0"><strong>Kyle</strong></td>
              <td className="font-mono text-start hover:cursor-pointer border-solid border-[1px] border-white border-t-0"><p className="p-2">dca0c0740138606d7b6af1dcce77c47f520f772f3b3f7473d836ef97bcfdef9c6a72cb1c4ecf592997ba65fe321f2c517e19500ba3963843cbdf922a6b433d14bf15b111101c1ef70e99fd18a7ab6c233ba7173214c95b70b79871592a01ac5a643f709c94e...</p>
              </td>
            </tr>
            <tr>
              <td className="p-1 border-solid border-[1px] border-white border-r-0 border-t-0"><strong>Kevin</strong>
              </td>
              <td className="font-mono text-start hover:cursor-pointer border-solid border-[1px] border-white border-t-0"><p className="p-2">a05122da6d7c152947e56845e163e01059ffca97f31f829208acf39d7b08e02969174c382323bd96dcc42bd9711f093565e0e8e4ee01d409af687679b7654389cecb7bc1302cef69df92781ee5e8c07034086af9801c1401c42549665d572c97bf26814bab5...</p></td></tr><tr><td className="p-1 border-solid border-[1px] border-white border-r-0 border-t-0"><strong>Kane</strong></td><td className="font-mono text-start hover:cursor-pointer border-solid border-[1px] border-white border-t-0"><p className="p-2">162f9c2e6683d03ecf1de223771ecaa72ed770c19311edecad8de5450f7e61aab9248f1261dd16f183c959ddec20e6d580a46fb488c1904f2a9683d42d087270866d9530a8e55e2d5b2b2aea968dd70877c26961078e614a4ba4c35ee9a4bce51f71f019063...</p></td></tr></tbody></table>
    </section>
  )
}

export default Home