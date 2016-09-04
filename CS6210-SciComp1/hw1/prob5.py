from __future__ import division, print_function
import matplotlib.pyplot as plt
import numpy as np
from math import exp, cos, sin

x0 = 1.2
step = np.arange(0.0,-20.0,-.5)
h = 10**step

# Calculate the derivative of f
f0 = cos(x0)
f2 = []
for h_ in h:
    temp = (sin(x0 + h_) - sin(x0-h_))/(2 * h_)
    f2.append(temp)

abs_err = []
d_err = abs(f0) / 2 * h

for f2_ in f2:
    abs_err.append(abs(f0 - f2_))

plt.loglog(h, abs_err, basex=10, label="Error")
plt.loglog(h,d_err, basex=10, label="Discretization Error")
plt.xlabel("h")
plt.ylabel("Absolute Error")
plt.title("Problem 5")
plt.legend(loc="best")
plt.savefig("hw1_prob5.pdf", type="pdf", bbox_inches="tight")
plt.show()
