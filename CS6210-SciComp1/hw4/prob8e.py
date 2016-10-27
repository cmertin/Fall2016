from __future__ import print_function, division
import matplotlib.pyplot as plt
import numpy as np
import numpy.linalg as nplin
import scipy.linalg as slin
from math import sqrt

A = np.array([[1,0,1,2],[2,3,5,10],[5,3,-2,6],[3,5,4,12],[-1,6,3,8]])
b = np.array([4,-2,5,-2,1])

ATA = A.transpose().dot(A)
ATb = A.transpose().dot(b)
AAT = A.dot(A.transpose())

x = np.linalg.solve(ATA, ATb)

Axb = np.linalg.norm(A.dot(x) - b)
print(np.linalg.norm(x))
print("||Ax - b|| = " + str(Axb))

vals = [0, 3, 6, 12]
for j in vals:
    lam = 10**(-j)
    id_mat = lam * np.identity(4)
    W = ATA + id_mat
    W = A.dot(W)
    Q, R = np.linalg.qr(W)
    x_gamma = np.linalg.inv(R).dot(Q.transpose())
    x_gamma = x_gamma.dot(A)
    x_gamma = x_gamma.dot(ATb)
    Axb = np.linalg.norm(A.dot(x_gamma) - b)
    Adiff = np.linalg.norm(ATA.dot(x_gamma) - ATb)
    print(j, Axb, np.linalg.norm(x_gamma), Adiff)
