from __future__ import print_function, division
import numpy as np

def f(x):
    return np.exp(x)

x0 = 0
h = []
fd = []

for i in range(1, 10):
    h.append(10**(-i))

for h_ in h:
    temp = (1/8 * h_**3) * ( f(x0 + 2 * h_) - f(x0 - 2 * h_) + 2 * f(x0 - h_) - 2 * f(x0 + h_))
    fd.append([h_, temp])

print("\\begin{table}[H]")
print("\centering")
print("\\begin{tabular}{l r}")
print("\\hline \\hline")
print("$h$ & $f^{\\prime}(x_{0})$\\\\")
print("\\hline")
for f in fd:
    temp1 = str(f[0])
    temp2 = "%.4e" % f[1]
    print(temp1 + " & " + temp2 + "\\\\")
print("\\hline")
print("\\end{tabular}")
print("\\caption{See {\\tt prob2.py}}")
print("\\end{table}")
