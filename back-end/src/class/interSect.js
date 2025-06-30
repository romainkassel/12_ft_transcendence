function onSegment(p, q, r) {
    return (q[0] <= Math.max(p[0], r[0]) && 
            q[0] >= Math.min(p[0], r[0]) &&
            q[1] <= Math.max(p[1], r[1]) &&
            q[1] >= Math.min(p[1], r[1]));
}

    // function to find orientation of ordered triplet (p, q, r)
    // 0 --> p, q and r are collinear
    // 1 --> Clockwise
    // 2 --> Counterclockwise
function orientation1(p, q, r) {
    let val = (q[1] - p[1]) * (r[0] - q[0]) -
              (q[0] - p[0]) * (r[1] - q[1]);

    // collinear
    if (val === 0) return 0;

    // clock or counterclock wise
    // 1 for clockwise, 2 for counterclockwise
    return (val > 0) ? 1 : 2;
}


// function to check if two line segments intersect
export function doIntersect(points) {

    // find the four orientations needed
    // for general and special cases
    let o1 = orientation1(points[0][0], points[0][1], points[1][0]);
    let o2 = orientation1(points[0][0], points[0][1], points[1][1]);
    let o3 = orientation1(points[1][0], points[1][1], points[0][0]);
    let o4 = orientation1(points[1][0], points[1][1], points[0][1]);

    // general case
    if (o1 !== o2 && o3 !== o4)
        return true;

    // special cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 === 0 &&
    onSegment(points[0][0], points[1][0], points[0][1])) return true;

    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 === 0 &&
    onSegment(points[0][0], points[1][1], points[0][1])) return true;

    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 === 0 &&
    onSegment(points[1][0], points[0][0], points[1][1])) return true;

    // p2, q2 and q1 are collinear and q1 lies on segment p2q2 
    if (o4 === 0 &&
    onSegment(points[1][0], points[0][1], points[1][1])) return true;

    return false;
}


