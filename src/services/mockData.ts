// src/services/mockData.ts

import type { CodeSample } from '../types';

export const sampleCode: CodeSample = {
  python: `def process_data(items):
    result = []
    for i in range(len(items)):
        try:
            value = items[i] * 2
            result.append(value)
        except:
            pass
    return result

# Inefficient duplicate check
def has_duplicates(lst):
    for i in range(len(lst)):
        for j in range(len(lst)):
            if i != j and lst[i] == lst[j]:
                return True
    return False`,
    
  java: `public class DataProcessor {
    // Inefficient string concatenation
    public String buildString(String[] words) {
        String result = "";
        for (int i = 0; i < words.length; i++) {
            result = result + words[i] + " ";
        }
        return result;
    }
    
    // Missing null check
    public int getLength(String text) {
        return text.length();
    }
}`,

  javascript: `function processData(items) {
    const result = [];
    for (let i = 0; i < items.length; i++) {
        result.push(items[i] * 2);
    }
    return result;
}

// Inefficient array search
function findItem(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}`,

  typescript: `function processData(items: number[]): number[] {
    return items.map(item => item * 2);
}

// Could use optional chaining
function getNestedValue(obj: any) {
    if (obj && obj.data && obj.data.value) {
        return obj.data.value;
    }
    return null;
}`
};