// Replace with your MetaMask address
const [signer] = await ethers.getSigners();
await signer.sendTransaction({
  to: "",
  value: ethers.utils.parseEther("100.0")
});