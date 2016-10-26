from __future__ import print_function, division
import matplotlib.pyplot as plt
import numpy as np
import numpy.linalg as nplin
import scipy.linalg as slin
from math import sqrt

# Calculates the Givens Rotations
def GivensRotation(a, b):
    if b == 0:
        c = 1
        s = 0
    else:
        if abs(b) > abs(a):
            r = a/b
            s = 1/sqrt(1 + r**2)
            c = s * r
        else:
            r = b/a
            c = 1/sqrt(1 + r**2)
            s = c * r
    return c, s

# Returns the QR Factorization based on Givens Rotations
def QRGivens(A):
    n = A.shape[0]
    m = A.shape[1]
    Q = np.identity(n)
    R = A.copy()
    for j in range(0, m):
        for i in range(m-1, j, -1):
            G = np.identity(n)
            c, s = GivensRotation(R[i-1][j],R[i][j])
            G[i-1][i-1] = c
            G[i-1][i] = -s
            G[i][i-1] = s
            G[i][i] = c
            R = G.transpose().dot(R)
            Q = Q.dot(G)
    return Q, R

def MinVector(A, x, ):
    residual = []
    Q, R = QRGivens(A)
    return inv(R).dot(Q.transpose().dot(b))

k = 5
n = k # Rows
m = k # Columns
# Builds Random Matrix
A = np.random.rand(n,m)
x = np.random.rand(m)

print(A.shape)

print(A)
print("\n")

# Builds Hessenberg form of A
H = slin.hessenberg(A)

# Can use the above functions to solve the problem
