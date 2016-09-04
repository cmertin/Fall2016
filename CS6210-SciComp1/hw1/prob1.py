from __future__ import division, print_function
import matplotlib.pyplot as plt
import numpy as np
from math import exp

x0 = 0.5
step = np.arange(0.0,-20.0,-.5)
h = 10**step

# Calculate the derivative of f
f0 = -2 * exp(-2 * x0)

# Derivative of f using discretization formula
f1 = []
for i in range(0, len(power)):
    h_ = h[i]
    temp = (exp(-2*(x0 + h_)) - exp(-2 * x0)) / h_
    f1.append(temp)

# Calculate the error
err = []
d_err = abs(f0/2 * h)

for f1_ in f1:
    err.append(abs(f0-f1_))

plt.loglog(h, err, basex=10, label="Error")
plt.loglog(h, d_err, basex=10, label="Discretization Error")
plt.legend(loc="best")
plt.xlabel("h")
plt.ylabel("Absolute Error")
plt.title("Problem 1")
plt.savefig("hw1_prob1.pdf", type="pdf", bbox_inches="tight")
plt.show()
