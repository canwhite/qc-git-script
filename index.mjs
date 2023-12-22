#!/usr/bin/env zx

import {question} from 'zx';

//去到你想操作的文件夹
const branchesOutput = await $`git branch`;
const branchesSstring = branchesOutput.toString();
const branchesArray = branchesSstring.split('\n');
const cleanedBranches = branchesArray
    .map((branch) => branch.trim())
    .filter(Boolean);

if (process.argv.includes('-d')) {
    console.log('请选择要删除的分支：');
    cleanedBranches.forEach((branch, index) => {
        console.log(`${index + 1}. ${branch}`);
    });

    const selectedBranchIndex = await question('请输入要删除的分支的编号: ');
    selectedBranch = cleanedBranches[selectedBranchIndex - 1];
    await $`git branch -D ${selectedBranch}`;
    console.log(`本地分支 ${selectedBranch} 已成功删除。`);
} else if (process.argv.includes('-s')) {
    await $`git add .`;
    await $`git stash`;
    console.log('更改已成功添加到暂存区并暂存。');
} else if (process.argv.includes('-a')) {
    await $`git stash apply`;
    console.log('提取stash内容成功');
} else if (process.argv.includes('-r')) {
    const currentBranchOutput = await $`git rev-parse --abbrev-ref HEAD`;
    const currentBranch = currentBranchOutput.toString().trim();
    await $`git checkout master`;
    await $`git pull`;
    await $`git checkout ${currentBranch}`;
    await $`git add .`;
    await $`git stash`;
    await $`git rebase master`;
    await $`git stash apply`;
    console.log('已成功rebase master。');
} else {
    console.log('未提供 -d 选项，不执行分支删除操作。');
}
