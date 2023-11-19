const { ethers } = require("ethers");

async function main() {
    const encode = new ethers.AbiCoder();
    console.log(
        encode.encode(
            ["address", "uint", "string", "string", "string", "uint", "uint"],
            [
                "0x2f42572502D2991F75A2F66BA97a28043E1A74a7",
                50000000000000,
                "test",
                "test1",
                "https://test",
                1700319595,
                1,
            ]
        )
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
