# Manually comparing the diff between two cherry runs

This is specially useful when you're running cherry diff inside a PR, and it fails. By default, the `cherry diff`
command will only show you the difference in number of occurrences. For instance, if you're checking for the difference
in circular dependencies, it'll say:

```
Last metric value: 484
Current metric value: 485
Difference: 1
```

If the above number is positive, it'll raise 💥 but it won't show the diff.

To manually find more details into what exactly changed, you can follow the steps.

## 1. Run cherry on master

For that, we'll use the command:

```
cherry run --metric="JS circular dependencies" --output=results_1.json
```

This will only run the selected metrics, and will export a JSON file with all the occurrences.

## 2. Run cherry on your branch

For that, we'll use the command:

```
cherry run --metric="JS circular dependencies" --output=results_2.json
```

This will only run the selected metrics, and will export a JSON file with all the occurrences.

## 3. Find the diff

Finally, you can use the `diff` command to figure out the difference:

```
diff results_1.json results_2.json | grep text
```

We'll also grep the `text` field only, so we remove the noise:

```
< "text": "app/assets/javascript/useFormBuilder.ts > app/assets/javascript/Input.tsx",
> "text": "app/assets/javascript/useFormBuilder.ts > app/assets/javascript/PostForm.tsx",
> "text": "app/assets/javascript/useFormVariant.ts > app/assets/javascript/PostList.tsx",
> "text": "packages/@blob/src/useChartModule.ts > packages/@blob/src/ChartContainer.tsx",
```

Note that `<` stands for the removed parts, and `>` is what's been added.
